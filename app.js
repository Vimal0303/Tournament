import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectdb from './config/connectdb.js'
import playerRoute from './routes/player.js'
import tournamentRoute from './routes/tournament.js'
import mappingRoutes from './routes/mapping.js'

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

//database
connectdb(DATABASE_URL)

//json
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//cors policy
app.use(cors())

//load routes
app.use('/player', playerRoute)
app.use('/tournament', tournamentRoute)
app.use('/mapping', mappingRoutes)

app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}`)
});