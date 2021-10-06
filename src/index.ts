import 'reflect-metadata'
import express from "express"
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { createConnection } from 'typeorm'

import userRoute from './routes/user.routes'
import rolesRoute from './routes/role.routes'
import permissionRoute from './routes/permission.routes'
import offerRoute from './routes/offer.routes'
import careerRoute from './routes/career.routes'
import authRoute from './routes/auth.routes'
import config from './config/config'


const PORT = config.PORT;

createConnection().then(async () => {
    const app = express()

    //middlewares
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(express.json())

    app.use(userRoute)
    app.use(rolesRoute)
    app.use(permissionRoute)
    app.use(offerRoute)
    app.use(careerRoute)
    app.use(authRoute)

    app.listen (PORT, () => console.log(`Server running on PORT ${PORT}`))

}).catch(error => console.log(error));