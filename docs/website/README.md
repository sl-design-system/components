# How to add component documentation

## Create a new branch

https://github.com/sanomalearning/design-system/branches

Create new branch:

<img alt="new branch image" src="https://user-images.githubusercontent.com/111562742/214255469-ce8a7d79-cf6f-41f2-a4b7-7fca8b829a43.png">



New branch should use `main` branch as a source:

<img width="443" alt="creating branch image" src="https://user-images.githubusercontent.com/111562742/214253485-d4a4bd36-3226-4bd1-a5f9-f82a77e09446.png">

Let’s name our new branch like `docs/button-documentation` or something similar (more info: https://github.com/sanomalearning/design-system/blob/main/CONTRIBUTING.md).

After creating our new branch, let’s open this branch and check the structure, where we are placing our component’s documentation.

The documentation for every component should be kept in separated directory in `categories/components` directory
![image](https://user-images.githubusercontent.com/111562742/214264218-83a2d908-6523-4ed5-90a2-c58a856c569a.png) 

eg.:
  - Button should have path like `docs/website/src/site/categories/components/button`,

  - Checkbox should have path like `docs/website/src/site/categories/components/checkbox` etc. 

Every component directory consists of **7 files**, like for a **button** directory there will be:

![image](https://user-images.githubusercontent.com/111562742/214264654-af3891e9-8814-45e0-b550-fc57d2f5af16.png)


- `accessibility.md` - file keeps content for the **“Accessibility”** tab for button component
- `button.json` - keeps information about layout and tags, layout should be the same for every component and tags should contain component name like button in this example
- `button.md` - file keeps informations such like **title**, which contains component name and **description**, which contains short component description
- `code.md` - file keeps content for the **“Code”** tab for a button component
- `overview.md` - file keeps content for the **“Overview”** tab for a button component
- `specs.md` - file keeps content for the **“Specs”** tab for a button component
- `usage.md` - file keeps content for the **“Usage”** tab for a button component

More information about component's files content you can find below.

## Component json file

### `button.json` file

![image](https://user-images.githubusercontent.com/111562742/214271396-14edcc44-d487-4fb4-822b-cef63e7da0d5.png)

`button.json` file consists of **layout** and **tags** elements. Layout should be the same for every component `"components/components.njk"` and tags should contain component name like `"button"` in this example

## Component markdown files

Markdown files contain YAML header with arguments, which are used for different purposes such like navigation, page title, layout etc.

### `accessibility.md` file

### `button.md` file

### `code.md` file

### `overview.md` file

When you want to save/commit your changes you should use option as follows:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214265893-3f964887-8e12-4774-a40a-e70c8da0775e.png">

Write proper commit message and use option 
> Commit directly to the `docs/your-branch-name` branch 

and click `Commit changes` button.

### `specs.md` file

### `usage.md` file



## Add documentation for a totally new component

If you'll need to add files structure for other component such as `radio` component for example, you should follow these steps:
...
- Please check if you're on the right branch
- Go to the directory `categories/components`
 
  ![image](https://user-images.githubusercontent.com/111562742/214264218-83a2d908-6523-4ed5-90a2-c58a856c569a.png) 

- Click `Add file` button and then `Create new file` to add a `radio` directory and `radio.json` file inside.

  ![image](https://user-images.githubusercontent.com/111562742/214283301-fa79efe4-a8d6-4c85-8a1f-e5f8c6b97263.png)


  https://user-images.githubusercontent.com/111562742/214285713-44396c59-8fd3-4cac-bd57-0c7989733e36.mov




and then ...




TODO:
- how to add images
- table
- do and don't sections
- how vertical tabs works and wrapping sections

TODO: how to create a PR


