import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vit-dev.52lga.mongodb.net/VIT-dev?retryWrites=true&w=majority`
        )
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

connectDB()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 2109

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
