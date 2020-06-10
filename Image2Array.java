import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import javax.imageio.ImageIO;

/**
 * Inspired by:
 * - https://dyclassroom.com/image-processing-project/how-to-get-and-set-pixel-value-in-java
 * - https://stackoverflow.com/questions/15364342/export-array-values-to-csv-file-java/15364544
 * - https://stackoverflow.com/questions/3607858/convert-a-rgb-color-value-to-a-hexadecimal-string
 *
 */
public class Image2Array {
	public static void main(String args[]) {
		String filename = "dragon";

	    try {
	    	// Read png image from file
	    	File file = new File("img/" + filename + ".png");
	    	BufferedImage image = ImageIO.read(file);
	    	
		    int imageWidth = image.getWidth();
		    int imageHeight = image.getHeight();
	    	
	    	// Write array to csv file
		    FileWriter fileWriter = new FileWriter("img/" + filename + ".csv");
		    BufferedWriter br = new BufferedWriter(fileWriter);
		    StringBuilder sb = new StringBuilder();

		    sb.append("[");
		    for (int y = 0; y < imageHeight; y++) {
				for (int x = 0; x < imageWidth; x++) {
					int rgb = image.getRGB(x, y);
					int r = (rgb >> 16) & 0xFF;
					int g = (rgb >> 8) & 0xFF;
					int b = (rgb >> 0) & 0xFF;
					String hex = String.format("#%02x%02x%02x", r, g, b);  
					sb.append("\'" + hex + "\'");
					sb.append(",");
				}
				if (y < imageHeight - 1) {
					sb.append("\n");
				} else {
					sb.setLength(sb.length() - 1);
					sb.append("];");
				}
			}
		    br.write(sb.toString());
		    br.close();
		    
	    } catch(IOException e){
	    	System.out.println(e);
	    }
	}
}
