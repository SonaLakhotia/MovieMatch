import { Client, ID,  Databases, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_ID
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID

// establishing the client, so that the appwrite functionalities can be accessed

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID)
const database = new Databases(client)

export const countSearch = async(searchMovie, movie) => {
  try
  {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchMovie', searchMovie)
    ])

    if(result.documents.length > 0){
      const doc = result.documents[0]
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1
      })
    }else{
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchMovie,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}}`,
        count: 1,
        movie_id: movie.id
      })
    }

    
  }catch(error){
    console.log(error)
  }
}

export const getTrendingMovies = async () => {
  try{
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count')
    ])

    return result.documents

  }catch(error){
    console.log(error)
  }
}