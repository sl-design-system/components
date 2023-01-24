# How to add component documentation

## Create a branch

https://github.com/sanomalearning/design-system/branches

Create new branch:

<img alt="new branch image" src="https://user-images.githubusercontent.com/111562742/214255469-ce8a7d79-cf6f-41f2-a4b7-7fca8b829a43.png">



New branch should use `main` branch as a source:

<img width="443" alt="creating branch image" src="https://user-images.githubusercontent.com/111562742/214253485-d4a4bd36-3226-4bd1-a5f9-f82a77e09446.png">

Let’s name new our new branch like `docs/button-documentation` or something similar (more info: https://github.com/sanomalearning/design-system/blob/main/CONTRIBUTING.md).

After creating our new branch, let’s open this branch and check the structure, where we are placing our component’s documentation.

The documentation for every component should be kept in separated directory in `categories/components` directory
![image](https://user-images.githubusercontent.com/111562742/214264218-83a2d908-6523-4ed5-90a2-c58a856c569a.png) 

eg.:
Button should have path like `docs/website/src/site/categories/components/button`,
Checkbox should have path like `docs/website/src/site/categories/components/checkbox` etc. 

Every component directory consists of **7 files**, like for a **button** directory there will be:

![image](https://user-images.githubusercontent.com/111562742/214264654-af3891e9-8814-45e0-b550-fc57d2f5af16.png)


- `accessibility.md` - file keeps content for the “Accessibility” tab for button component
- `button.json` - keeps information about layout and tags, layout should be the same for every component and tags should contain component name like button in this example
- `button.md` - title contains component name and description contains short component description
- `code.md` - file keeps content for the “Code” tab for a button component
- `overview.md` - file keeps content for the “Overview” tab for a button component
- `specs.md` - file keeps content for the “Specs” tab for a button component
- `usage.md` - file keeps content for the “Usage” tab for a button component

## `accessibility.md` file

## `button.json` file

## `button.md` file

## `code.md` file

## `overview.md` file

When you want to save/commit your changes you should use option as follows:

<img width="482" alt="image" src="https://user-images.githubusercontent.com/111562742/214265893-3f964887-8e12-4774-a40a-e70c8da0775e.png">

Write proper commit message and use option 
> "Commit directly to the `docs/your-branch-name` branch" 

and click `commit changes` button.

## `specs.md` file

## `usage.md` file




TODO:
-  how to add images
- table
- do and don't sections
- how vertical tabs works and wrapping sections

TODO: how to create a PR


