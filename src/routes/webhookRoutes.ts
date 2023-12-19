import clerkClient, { WebhookEvent } from '@clerk/clerk-sdk-node'
import bodyParser from 'body-parser'
import express from 'express'
import { Webhook } from 'svix'
import { InputUser } from '../types.js'
import { prisma } from '../util/prisma_client.js'

const router = express.Router()

router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async function (req, res) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
      throw new Error('You need a WEBHOOK_SECRET in your .env')
    }

    // Grab the headers and body
    const headers = req.headers
    const payload = req.body

    // Get the Svix headers for verification
    const svix_id = headers['svix-id'] as string
    const svix_timestamp = headers['svix-timestamp'] as string
    const svix_signature = headers['svix-signature'] as string

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      })
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err: any) {
      // Console log and return errro
      console.log('Webhook failed to verify. Error:', err.message)
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }

    // Grab the ID and TYPE of the Webhook
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
    // Console log the full payload to view

    if (eventType === 'user.created') {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data

      const user: InputUser = {
        clerkID: id,
        email: email_addresses[0].email_address,
        name: username,
        photo: image_url,
        password: 'NO PASSWORD',
      }

      console.log('input user: ', user)

      const newUser = await prisma.user.create({
        data: {
          ...user,
        },
      })

      if (newUser) {
        console.log('new user is created successfully')
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser.userID,
          },
        })
      }

      return res.status(201).json({
        message: 'Created successfully',
        user: newUser,
      })
    }

    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = evt.data

      const user = {
        name: username,
        photo: image_url,
      }

      await prisma.user.update({
        data: user,
        where: {
          clerkID: id,
        },
      })

      return res.status(200).json({
        message: 'Updated successfully',
      })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      await prisma.user.delete({
        where: {
          clerkID: id,
        },
      })

      return res.status(200).json({
        message: 'Deleted successfully',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook received',
    })
  },
)

export default router
