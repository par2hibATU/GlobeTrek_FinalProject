import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async(req, res, next)=>{
    const newHotel = new Hotel(req.body);
    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    }catch(err){
        next(err);
    }
        
}

export const updateHotel = async(req, res, next)=>{
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body}, 
            { new: true });
        res.status(200).json(updatedHotel)
    }catch(err){
        next(err);
    }
        
}

export const deleteHotel = async(req, res, next)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("This Hotel has been deleted")
    }catch(err){
        next(err);
    }
        
}

export const getHotel = async(req, res, next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel)
    }catch(err){
        next(err);
    }
        
}

export const getAllHotels = async (req, res, next) => {
    try {
        // Convert query parameters to numbers
        const minPrice = parseInt(req.query.min) || 1;
        const maxPrice = parseInt(req.query.max) || 999;
        const limit = parseInt(req.query.limit) || 0; // Default 0 means no limit
        
        // Build filter object dynamically
        const filters = { ...req.query };
        delete filters.min;
        delete filters.max;
        delete filters.limit;

        // Add price range condition
        filters.cheapestPrice = { $gte: minPrice, $lte: maxPrice };

        // Fetch hotels with filter and limit
        const hotels = await Hotel.find(filters).limit(limit);
        
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};


export const countByCity = async(req, res, next)=>{
    const cities = req.query.cities.split(",")
    try{
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city:city})
        }));
        res.status(200).json(list)
    }catch(err){
        next(err);
    }
        
}

export const countByType = async(req, res, next)=>{
    try{
        const hotelCount =await Hotel.countDocuments({type:"Hotel"});
        const resortCount =await Hotel.countDocuments({type:"Resort"});
        const apartmentCount =await Hotel.countDocuments({type:"Apartment"});
        const airbnbCount = await Hotel.countDocuments({type:"Airbnb"});

        res.status(200).json([
            {type:"Hotel", count: hotelCount},
            {type:"Resort", count: resortCount},
            {type:"Apartment", count: apartmentCount},
            {type:"Airbnb", count: airbnbCount},
        ]);
    }catch(err){
        next(err);
    }
        
}

export const getHotelRooms = async (req, res, next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id)
        const list = await Promise.all(hotel.rooms.map((room)=>{
            return Room.findById(room);
        }))
        res.status(200).json(list)
    }catch(err){
        next(err)
    }
}