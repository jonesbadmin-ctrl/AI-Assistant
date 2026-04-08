/**
 * Generate Document API
 * 
 * POST /api/documents/generate
 * Body: { content, type, title? }
 * Returns: downloadable file
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Generate DOCX
async function generateDocx(content: string, title: string): Promise<Buffer> {
  // Split content into paragraphs
  const paragraphs = content.split('\n').map(line => 
    new Paragraph({
      children: [new TextRun(line)],
      spacing: { after: 200 },
    })
  )

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        ...paragraphs,
      ],
    }],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

// Generate PDF using pdf-lib
async function generatePdf(content: string, title: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  
  // Add a page
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const { width, height } = page.getSize()
  
  let y = height - 50 // Start from top
  
  // Title
  page.drawText(title, {
    x: 50,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  })
  y -= 40
  
  // Content - split by paragraphs
  const lines = content.split('\n')
  for (const line of lines) {
    // Check if we need a new page
    if (y < 50) {
      const newPage = pdfDoc.addPage([595.28, 841.89])
      y = newPage.getHeight() - 50
    }
    
    // Wrap long lines
    const maxWidth = width - 100
    const words = line.split(' ')
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const textWidth = font.widthOfTextAtSize(testLine, 12)
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: 50,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        })
        y -= 18
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      page.drawText(currentLine, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      })
      y -= 18
    }
    
    // Add extra spacing between paragraphs
    y -= 8
  }
  
  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, type, title } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (!type || !['docx', 'pdf'].includes(type)) {
      return NextResponse.json({ error: 'Type must be docx or pdf' }, { status: 400 })
    }

    const docTitle = title || 'Document'

    let buffer: Buffer
    let contentType: string
    let filename: string

    if (type === 'docx') {
      buffer = await generateDocx(content, docTitle)
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      filename = `${docTitle.replace(/[^a-z0-9]/gi, '_')}.docx`
    } else {
      buffer = await generatePdf(content, docTitle)
      contentType = 'application/pdf'
      filename = `${docTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`
    }

    return new NextResponse(buffer as Buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating document:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}