const {postProduct} = require('../models/product')

const createProduct = async(req,res)=>{
    try {
        let image = ''
        const {id} = req.userPayload
        const {files} = req
   
    if(files.length){
        image = files
    }
    
        const {data,message} = await postProduct(req.body,image,id)
        res.status(200).json({
            data,
            message
        })
        
    } catch (error) {
        const {message} = error
        res.status(500).json({
            error:message
        })
    }
}




module.exports = {createProduct}