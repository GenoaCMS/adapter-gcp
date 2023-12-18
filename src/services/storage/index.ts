import type {
  storage as storageT
} from '@genoacms/cloudabstraction'
import { type Bucket, Storage } from '@google-cloud/storage'
import config from '../../config.js'

const storage = new Storage({
  credentials: config.storage.credentials
})

const buckets: Bucket[] = []
for (const bucket of config.storage.buckets) {
  buckets.push(storage.bucket(bucket))
}

const listDirectory: storageT.listDirectory = async ({ limit, prefix }) => {
  const [files] = await buckets[0].getFiles({
    prefix,
    maxResults: limit
  })
  return files.map((file) => {
    return {
      name: file.name,
      size: file.metadata.size,
      // @ts-expect-error: Handle this
      lastModified: new Date(file.metadata.updated)
    } as storageT.StorageObject
  })
}

// const dir = await listDirectory({
//   limit: 10,
// })
//
// console.log(dir)

export {
  listDirectory
}
