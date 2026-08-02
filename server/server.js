import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import adminRouter from './routes/adminRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())

// routes FIRST (safe)
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => {
  res.send('API is running!')
})

connectDB()
  .then(() => {
    console.log("MongoDB connected")

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("DB connection error:", err)
  })