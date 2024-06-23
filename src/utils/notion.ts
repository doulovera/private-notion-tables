interface Property {
	type: string
	id: string
	title?: {
		type: string,
		text?: {
			content: string,
			link: string | null
		},
		plain_text: string,
		href: string | null
	}[]
	select?: {
		id: string
		name: string
		color: string
	}
	checkbox?: boolean
}

export function propertyParser (property: Property) {
  switch (property.type) {
    case 'title':
      	return property.title![0].plain_text
    case 'select':
    	return property.select!.name
	case 'checkbox':
		return property.checkbox
    default:
		throw new Error('Property type not supported: ' + property.type)
  	}
}