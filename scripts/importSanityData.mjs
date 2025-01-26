// import { createClient } from '@sanity/client';
// require('dotenv').config();


// const client = createClient({
//   projectId: "stcwf7de",
//   dataset:"production",
//   useCdn: true,
//   apiVersion:'2025-01-26',
//   token:"ske9Xb8WpIcu9dVQvS6m1VxR6YpTUuBjhL5lsJKmDkr7hlKdiEGREhjpSspEoeXPrllMqOLXIENeBTRT2LoWJtYx77YL1q3WMPdqNhXklULhi3rtcK6i8prjRwbWqAFWOoR6GRiVIycpygPiebrUQXLgndC1xcrvh5s0ya2KcGX0hnVdw1fv"
// });

// async function uploadImageToSanity(imageUrl) {
//   try {
//     console.log(`Uploading image: ${imageUrl}`);

//     const response = await fetch(imageUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch image: ${imageUrl}`);
//     }

//     const buffer = await response.arrayBuffer();
//     const bufferImage = Buffer.from(buffer);

//     const asset = await client.assets.upload('image', bufferImage, {
//       filename: imageUrl.split('/').pop(),
//     });

//     console.log(`Image uploaded successfully: ${asset._id}`);
//     return asset._id;
//   } catch (error) {
//     console.error('Failed to upload image:', imageUrl, error);
//     return null;
//   }
// }

// async function uploadProduct(product) {
//   try {
//     const imageId = await uploadImageToSanity(product.imageUrl);

//     if (imageId) {
//       const document = {
//         _type: 'products',
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         image: {
//           _type: 'image',
//           asset: {
//             _ref: imageId,
//           },
//         },
//         category: product.category,
//         discountPercent: product.discountPercent,
//         isNew: product.isNew,
//         colors: product.colors,
//         sizes: product.sizes
//       };

//       const createdProduct = await client.create(document);
//       console.log(`Product ${product.name} uploaded successfully:`, createdProduct);
//     } else {
//       console.log(`Product ${product.name} skipped due to image upload failure.`);
//     }
//   } catch (error) {
//     console.error('Error uploading product:', error);
//   }
// }

// async function importProducts() {
//   try {
//     const response = await fetch('https://template1-neon-nu.vercel.app/api/products');

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const products = await response.json();

//     for (const product of products) {
//       await uploadProduct(product);
//     }
//   } catch (error) {
//     console.error('Error fetching products:', error);
//   }
// }

// importProducts();


import { createClient } from '@sanity/client';
import 'dotenv/config';
import fetch from 'node-fetch'; // Required for `fetch` in Node.js (if you're using a Node.js version < 18)
import { Buffer } from 'buffer'; // Ensure Buffer is imported for binary data handling

const client = createClient({
  projectId: "stcwf7de",
  dataset: "production",
  useCdn: true,
  apiVersion: '2025-01-26',
  token: process.env.SANITY_API_TOKEN || "ske9Xb8WpIcu9dVQvS6m1VxR6YpTUuBjhL5lsJKmDkr7hlKdiEGREhjpSspEoeXPrllMqOLXIENeBTRT2LoWJtYx77YL1q3WMPdqNhXklULhi3rtcK6i8prjRwbWqAFWOoR6GRiVIycpygPiebrUQXLgndC1xcrvh5s0ya2KcGX0hnVdw1fv"
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const bufferImage = Buffer.from(buffer);

    const asset = await client.assets.upload('image', bufferImage, {
      filename: imageUrl.split('/').pop(),
    });

    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

async function uploadProduct(product) {
  try {
    const imageId = await uploadImageToSanity(product.imageUrl);

    if (imageId) {
      const document = {
        _type: 'products',
        name: product.name,
        description: product.description,
        price: product.price,
        image: {
          _type: 'image',
          asset: {
            _ref: imageId,
          },
        },
        category: product.category,
        discountPercent: product.discountPercent,
        isNew: product.isNew,
        colors: product.colors,
        sizes: product.sizes
      };

      const createdProduct = await client.create(document);
      console.log(`Product ${product.name} uploaded successfully:`, createdProduct);
    } else {
      console.log(`Product ${product.name} skipped due to image upload failure.`);
    }
  } catch (error) {
    console.error('Error uploading product:', error);
  }
}

async function importProducts() {
  try {
    const response = await fetch('https://template1-neon-nu.vercel.app/api/products');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const products = await response.json();

    for (const product of products) {
      await uploadProduct(product);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

importProducts();
