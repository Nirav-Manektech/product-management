import { PopulateOptions } from 'mongoose';

/** 
 * Converts a semicolon-separated populate string into an array of PopulateOptions. 
 * Example input: "locality:name;city:name;propertyType:name" 
 */ 
export const parsePopulateString = (populateStr?: string): PopulateOptions[] => { 
  if (!populateStr) return []; 

  return populateStr.split(';').map((item) => { 
    const [path, select] = item.split(':'); 
    const populateOption: PopulateOptions = { path: path.trim() }; 

    if (select)  
      populateOption.select = select.trim(); 
     

    return populateOption; 
  }); 
};