import os
import subprocess

def convert_jpg_to_webp(directory):
    """
    Convert all .jpg in data/** directories to .webp and delete the original .jpg files for the images to load in frontend.
    """
    for root, _, files in os.walk(directory):
        print()
        print(f"Walking through directory: {root}")
        print(f"Files found: {files}")
        
        jpg_files = [f for f in files if f.lower().endswith('.jpg')]
        print(f"Checking directory: {root}, found .jpg files: {jpg_files}")
        if jpg_files:
            os.chdir(root)

            # Convert all .jpg files in the current directory to .webp
            try:
                subprocess.run(['magick', 'mogrify', '-format', 'webp', '*.jpg'], check=True)
            except subprocess.CalledProcessError as e:
                print(f"Error during conversion in {root}: {e}")
                continue

            # Remove the original .jpg files
            for jpg_file in jpg_files:
                jpg_path = os.path.join(jpg_file)
                try:
                    os.remove(jpg_path)
                    print(f"Deleted: {jpg_path}")
                except OSError as e:
                    print(f"Error deleting {jpg_path}: {e}")

if __name__ == "__main__":
    base_directory = "data"
    if os.path.isdir(base_directory):
        convert_jpg_to_webp(base_directory)
    else:
        print(f"The directory '{base_directory}' does not exist.")