import mammoth from 'mammoth'

export const extractInfo = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
    // Mammoth converts .docx to HTML strings
    const result = await mammoth.convertToHtml({ arrayBuffer })
    return {
      name: file.name,
      html: result.value // The generated HTML
    }
}
