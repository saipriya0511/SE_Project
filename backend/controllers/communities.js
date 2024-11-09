const CommunitiyModel = require("../Models/communitiesModel");


const getCommunities = async (req, res) => {
    try {
        const data = await CommunitiyModel.find();
        if(data.length === 0){
            return res.status(404).json({message:"No data found"})
        }

        return res.json(data);
    } catch (error) {
        console.log(error);
    }
};


module.exports = {getCommunities}