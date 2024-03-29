const Hotel = require("../models/hotel");
const Transaction = require("../models/transaction");
const Room = require("../models/room");

async function findAvaiableRooms(hotel, selectedStartDate, selectedEndDate) {
  const availableRooms = [];

  const hotelTransactionsAtDateRange = await Transaction.find({
    hotel: hotel._id,
    $or: [
      {
        // find all transactions whose duration is within selected date range
        dateStart: { $lte: new Date(selectedEndDate) },
        dateEnd: { $gte: new Date(selectedStartDate) }
      },
      {
        // find all transactions whose duration is part of selected date range
        dateStart: { $gte: new Date(selectedStartDate) },
        dateEnd: { $lte: new Date(selectedEndDate) }
      }
    ]
  });

  // Get unique transactions
  const hotelTransactions = new Set(
    hotelTransactionsAtDateRange.filter((transaction) => transaction.id)
  );
  // console.log(hotelTransactions);

  // Get room types of current hotel => find which room numbers of each room type are still available
  const curHotel = await Hotel.findById({ _id: hotel._id }).populate("rooms");
  const hotelRooms = curHotel.rooms;

  hotelRooms.forEach((roomType) => {
    // If there's no transaction found => all rooms are available
    if (hotelTransactions.length === 0) {
      availableRooms.push(roomType);
    } else {
      // If there's transaction => find available rooms
      const updatedRoomType = roomType;
      hotelTransactions.forEach((transaction) => {
        // each transaction has a 'room' property: [{roomId: 123, roomNumbers: 101, price: 450}, {roomId: 123, roomNumbers: 102, price: 450}]
        transaction.room.forEach((bookedRoom) => {
          // check if the booked room type matches the current checking room type
          // find room numbers that aren't booked in transaction
          if (bookedRoom.roomId.toString() === roomType._id.toString()) {
            const availableRoomNumbers = updatedRoomType.roomNumbers.filter(
              (num) => num !== bookedRoom.roomNumbers
            );
            updatedRoomType.roomNumbers = availableRoomNumbers;
          }
        });
      });
      availableRooms.push(updatedRoomType);
    }
  });
  return availableRooms;
}

exports.getPropertiesCount = async (req, res, next) => {
  try {
    // const propertiesCountByCity = [];
    const cities = ["Ha Noi", "Ho Chi Minh", "Da Nang"];

    // get an array of promises which add an object of city & count for each city
    const promises = cities.map(async (c) => {
      const count = await Hotel.find({ city: c }).countDocuments();
      return { [c]: count };
    });

    // resolve promises in parallel
    const propertiesCountByCity = await Promise.all(promises);

    return res.status(200).json(propertiesCountByCity);
  } catch (err) {
    console.error("Error fetching property counts:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTypesCount = async (req, res, next) => {
  try {
    const types = ["hotel", "apartments", "resorts", "villas", "cabins"];

    // get an array of promises which add an object of type & count for each hotel type
    const promises = types.map(async (t) => {
      const count = await Hotel.find({ type: t }).countDocuments();
      return { [t]: count };
    });

    // resolve promises in parallel
    const typescount = await Promise.all(promises);

    return res.status(200).json(typescount);
  } catch (err) {
    console.error("Error fetching type counts:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTopRatedHotels = async (req, res, next) => {
  try {
    const topRatedHotels = await Hotel.find().sort({ rating: -1 }).limit(3);
    return res.status(200).json(topRatedHotels);
  } catch (err) {
    console.error("Error fetching top rated hotels:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchHotels = async (req, res, next) => {
  try {
    const {
      location = "Ha Noi",
      startDate = new Date(),
      endDate = new Date(),
      adult = 1,
      children = 0,
      room = 1
    } = {
      ...req.body
    };

    // 1. Find hotels that match the search location
    // 2. Loop through each hotel & find all transactions related to that hotel
    // 3. Count the number of avaiable rooms within search date range
    // 4. If the number of rooms left >= search room number => add to the qualified hotel list
    const qualifiedHotels = [];
    const cityBasedHotels = await Hotel.find({ city: location }).populate(
      "rooms"
    );
    for (const hotel of cityBasedHotels) {
      const availableRooms = await findAvaiableRooms(hotel, startDate, endDate);
      // available rooms number
      const availableRoomsNum = availableRooms.reduce(
        (acc, val) => acc + val.roomNumbers.length,
        0
      );
      // available people slots
      const totalPeopleCapacity = availableRooms.reduce(
        (acc, val) => acc + Number(val.maxPeople) * val.roomNumbers.length,
        0
      );
      // console.log(availableRooms);
      // console.log(availableRoomsNum, totalPeopleCapacity);

      if (
        availableRoomsNum >= Number(room) &&
        totalPeopleCapacity >= Number(adult) + Number(children)
      ) {
        qualifiedHotels.push(hotel);
      }
    }
    // console.log(qualifiedHotels);
    return res.status(200).json(qualifiedHotels);
  } catch (err) {
    console.error("Error fetching search hotels:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchHotel = async (req, res, next) => {
  try {
    const id = req.body.id;
    const fetchedHotel = await Hotel.findById(id);
    return res.status(200).json(fetchedHotel);
  } catch (err) {
    console.error("Error fetching the hotel:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchAvailableRooms = async (req, res, next) => {
  try {
    const _id = req.body.id;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    // Get current hotel with rooms property populated
    const curHotel = await Hotel.findById(_id).populate("rooms");

    // Get array of avaiableRooms
    const availableRooms = await findAvaiableRooms(
      curHotel,
      startDate,
      endDate
    );
    // console.log(availableRooms);
    return res.status(200).json(availableRooms);
  } catch (err) {
    console.error("Error fetching avaiable rooms:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postTransaction = (req, res, next) => {
  // Add transaction to transaction collection
  const transaction = new Transaction(req.body);
  transaction.save();
  return res.status(200).send();
};

exports.getTransaction = (req, res, next) => {
  const userId = req.body.id;
  Transaction.find({ user: userId })
    .populate("hotel")
    .then((transactions) => {
      return res.status(200).json(transactions);
    })
    .catch((err) => console.log(err));
};
