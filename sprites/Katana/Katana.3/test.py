from PIL import Image
import os
import math

def create_sprite_sheet(image_paths, rows, cols, output_path):
    # Load all images
    images = [Image.open(img_path) for img_path in image_paths]

    # Assuming all images are the same size, get the dimensions of one image
    img_width, img_height = images[0].size

    # Create a new image with enough space to hold all images
    sprite_sheet = Image.new("RGBA", (cols * img_width, rows * img_height))

    # Paste each image into the sprite sheet
    for index, image in enumerate(images):
        x = math.ceil((index % cols) * img_width)  # Column position
        y = math.ceil((index // cols) * img_height)  # Row position
        print(img_width, img_height)
        sprite_sheet.paste(image, (x, y))

    # Save the final sprite sheet
    sprite_sheet.save(output_path)
    print(f"Sprite sheet saved to {output_path}")


# Example usage
if __name__ == "__main__":
    # Path to the images (change to your file paths)
    image_folder = "E:\Downloads\game js 2\sprites\Baseball\Baseball.walk"
    image_paths = [os.path.join(image_folder, img) for img in os.listdir(image_folder) if img.endswith(".png")]

    # Define rows and columns for the sprite sheet
    rows = 2  # Number of rows
    cols = 3  # Number of columns

    # Output sprite sheet file path
    output_path = "sprite_sheet.png"

    image_count = len(image_paths)

    # Create the sprite sheet
    create_sprite_sheet(image_paths, 1, image_count, os.path.join(image_folder, output_path))