import { Router } from 'express'

export const router = Router()

router.get('/', (req, res) => {
  res.send('api')
})

export default router
