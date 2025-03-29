import { Request, Response } from 'express';
import { z } from 'zod';
import { generateCharacterDetails } from '../services/groqService.js';
import { extractContentFromUrl } from '../services/exaService.js';
import { CharacterData } from '../types';

const GenerateCharacterSchema = z.object({
  description: z.string().min(10).max(1000),
  relationship: z.string().min(5).max(200),
  url: z.string().url().optional(),
});

export async function generateCharacter(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received generateCharacter request:', req.body);
      
      const validationResult = GenerateCharacterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        console.error('Validation error:', validationResult.error.format());
        res.status(400).json({
          status: 'error',
          message: 'Invalid input',
          errors: validationResult.error.format()
        });
        return;
      }
      
      const { description, relationship, url } = validationResult.data;
      
      let enhancedDescription = description;
      if (url) {
        try {
          const extractedContent = await extractContentFromUrl(url);
          enhancedDescription = `${description}\n\nAdditional context from URL: ${extractedContent}`;
        } catch (error) {
          console.error('Error extracting content from URL:', error);
          // Continue with original description if URL extraction fails
        }
      }
      
      try {
        const characterData = await generateCharacterDetails(enhancedDescription, relationship);
        
        const finalCharacterData = {
          ...characterData,
          originalDescription: description
        };
        
        res.status(200).json({
          status: 'success',
          data: finalCharacterData
        });
      } catch (error) {
        console.error('Error generating character details:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in generateCharacter:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate character',
        error: error instanceof Error ? error.stack : undefined
      });
    }
}

export async function getCharacterFromUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    
    if (!url) {
      res.status(400).json({
        status: 'error',
        message: 'URL is required'
      });
      return;
    }

    try {
      const content = await extractContentFromUrl(url);
      const characterData = await generateCharacterDetails(
        `Create a character based on the following content: ${content}`,
        "new acquaintance who recently met"
      );
      res.status(200).json({
        status: 'success',
        data: characterData
      });
    } catch (error) {
      console.error('Error extracting content:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in getCharacterFromUrl:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to extract content',
      error: error instanceof Error ? error.stack : undefined
    });
  }
}