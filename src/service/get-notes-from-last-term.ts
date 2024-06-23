import { Client } from '@notionhq/client'
import { propertyParser } from '../utils/notion'

const NOTION_TOKEN = import.meta.env.NOTION_TOKEN
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID
const PROPERTY_TO_FILTER = 'Ciclo'
const VALUE_TO_FILTER = '2024-I'

const notion = new Client({
  auth: NOTION_TOKEN,
})

interface Note {
  id: string,
  title: string,
  createdAt: string,
  subject: string,
  term: string,
  public_url: string,
}

export async function getNotesFromLastTerm(): Promise<Note[]> {
  const query = {
    database_id: DATABASE_ID,
    filter: {
      property: PROPERTY_TO_FILTER,
      select: {
        equals: VALUE_TO_FILTER,
      },
    }
  }

  const response = await notion.databases.query(query)
  return mapNotes(response.results)
}

function mapNotes (notes: any): Note[] {
  const publicChildren = notes.filter((note: any) => note.public_url)

  return publicChildren.map((
    { id, properties, public_url, created_time }:
    { id: string, properties: any, public_url: string, created_time: string}
  ) => {

    const usedProperties = ['Name', 'Materia', 'Ciclo']

    const filterUsedProperties = Object.entries(properties).filter(([property]) => usedProperties.includes(property))
    const mapped = filterUsedProperties.map(([name, value]) => {
      return [name, propertyParser(value as any)]
    })

    const { Name: title, Materia: subject, Ciclo: term } = Object.fromEntries(mapped)

    const createdAt = new Date(created_time).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })

    return {
      id,
      title,
      subject,
      term,
      public_url,
      createdAt,
    }
  })
}
