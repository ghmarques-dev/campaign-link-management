import express from 'express'
import { routes } from './routes'
import { errorHandler } from './middlewares/error-handler'
import { env } from '@/infra/env'

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorHandler)

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`))
