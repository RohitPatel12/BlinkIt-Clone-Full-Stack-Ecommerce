    import { Router } from 'express'
    import auth from '../middleware/auth.js'
    import { addAddressController, deleteAddresscontroller, getAddressController, setDefaultAddressController, updateAddressController } from '../controllers/address.controller.js'

    const addressRouter = Router()
    
    // ok
    addressRouter.post('/create',auth,addAddressController)
    addressRouter.get("/get",auth,getAddressController)
    addressRouter.put('/update',auth,updateAddressController)
    addressRouter.delete("/disable",auth,deleteAddresscontroller)
    addressRouter.put("/set-default", auth, setDefaultAddressController);
    
    export default addressRouter