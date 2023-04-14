<p align="center">
    <img src="https://raw.githubusercontent.com/i74ifa/vscode-create-files/master/icon.webp" alt="Create Files" />
</p>

# Create Files

create PHP Class and Vue files and React from context menu in file explorer or in opened file.

The namespace is auto-resolved through `composer.json` file.

you can edit template from settings
make sure use settings.json to edit template because settings ui not support new lines

## Create file

to create file simple click on any folder in your workspace and choose new File

![CreateTrait](https://raw.githubusercontent.com/i74ifa/vscode-create-files/master/simple-alt.png)

## Edit Templates

go to settings and search `createfiles`
this all template

### explain slugs

#### PHP Templates

`{{beforeNamespace}}` this if use enable strict mode we replace it to `declare(strict_types=1);`

`{{namespace}}` replace to namespace from composer.json

`{{className}}` replace it to File name

`\n` insert new line in the text

`\t` Insert a tab in the text

#### React Files

`{{className}}` replace to File name

![](https://raw.githubusercontent.com/i74ifa/vscode-create-files/master/simple-create-file.mp4)
