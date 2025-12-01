// import { defineContentConfig, defineCollection } from '@nuxt/content'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    gonggao: defineCollection({
      type: 'page',
      source: 'gonggao/*.md',
      schema: z.object({
        date: z.string().transform((str) => new Date(str))
      })
    })
  }
})
