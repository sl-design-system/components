# How to add component documentation

## Create a new branch

https://github.com/sanomalearning/design-system/branches

Create a new branch:

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

> Identation in markdown files is an important thing.

Markdown files contain YAML header with arguments, which are used for different purposes such like navigation, page title, layout etc.

### `button.md` file
YAML header in `button.md` (`component.md`) file contains:

```
---
title: Button
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
layout: "components/components.njk"
tags: component
eleventyNavigation:
  parent: Components
  key: Button
  order: 2
---
```
  - `title` contains a component name, which we can find in the output file:
    <img width="482" alt="image" src="https://user-images.githubusercontent.com/111562742/214508369-2bd45963-1013-4214-ba01-3c4e6a58a461.png">
    
    - `description` contains short description of the component, which we can find in the output file:
    <img width="482" alt="image" src="https://user-images.githubusercontent.com/111562742/214509804-c19ff048-cd43-4cf7-8044-3451b84ad6d9.png">

    - `layout` for components should always contain `"components/components.njk"`
    - `tags` should always contain `component` for `component.md` files
    - `eleventyNavigation` contains options used for navigation on our website, `parent` should be `Components` and `order` represents order of showing components in our navigation (Button order is 2, so we can find it on the second place under `Components` navigation item):   

      ![image](https://user-images.githubusercontent.com/111562742/214509125-5fbb9df4-f869-4207-8bb4-a2bc3bd7b191.png)





### `accessibility.md` file

YAML header in `accessibility.md` file contains:

```
---
title: Button accessibility
tags: accessibility
eleventyNavigation:
  parent: Button
  key: ButtonAccessibility
---
```


  - `title` component accessibility title like `Component accessibility` (`Button accessibility` in this case)
    
  - `tags` for `accessibility.md` files should contain `accessibility` value, which is used for **Accessibility tab** content rendering
    
  - `eleventyNavigation` which are options used for the navigation on our website, `parent` should be the name of component (`Button` in this case) and `key` like `ComponentAccessibility` (`ButtonAccessibility` in this case)


### `code.md` file
```
---
title: Button code
tags: code
eleventyNavigation:
  parent: Button
  key: ButtonCode
---
```

  - `title` component code title like `Component code` (`Button code` in this case)
    
  - `tags` for `code.md` files should contain `code` value, which is used for **Code tab** content rendering
    
  - `eleventyNavigation` which are options used for the navigation on our website, `parent` should be the name of component (`Button` in this case) and `key` like `ComponentCode` (`ButtonCode` in this case)

### `overview.md` file

```
---
title: Button
tags: overview
eleventyNavigation:
  parent: Button
  key: ButtonOverview
---
```

When you want to save/commit your changes you should use option as follows:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214265893-3f964887-8e12-4774-a40a-e70c8da0775e.png">

Write proper commit message and use option 
> Commit directly to the `docs/your-branch-name` branch 

and click `Commit changes` button.

### `specs.md` file

```
---
title: Button specs
tags: specs
eleventyNavigation:
  parent: Button
  key: ButtonSpecs
---
```

### `usage.md` file

```
---
title: Button usage
tags: usage
eleventyNavigation:
  parent: Button
  key: ButtonUsage
---
```


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



#### Images
- how to add images

Images should be stored in the `assets` directory:

![image](https://user-images.githubusercontent.com/111562742/214331361-fa025dbf-7e9d-4242-88d2-d621c1ab4460.png)

First we need to upload files which we need

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214331556-d7701709-4b0d-4af8-ad68-d036c77f6e0a.png">

![image](https://user-images.githubusercontent.com/111562742/214331641-b929f553-829e-441f-b02f-2d8cedd33dd2.png)

and then we can use them in our markdown files as follows (please remember about commiting changes first):

`![Alt text example](/assets/images/example-dont.svg "don't picture")` where `Alt text example` is an alternative text (`alt` attribute), more: https://www.w3.org/TR/WCAG20-TECHS/H37.html


#### Table

Table in the markdown file looks as follows:

```
| Element | Attribute              | Value                | Description                                                                                    |
---------|------------------------|----------------------|------------------------------------------------------------------------------------------------|
| Label   | <code>ariaLabel</code> | <code>string</code>  | Define a string that labels the action to be performed when the user interacts with the button |
| Label   | <code>ariaLabel</code> | <code>string</code>  | Define a string that labels the action to be performed when the user interacts with the button |
| Label   | <code>ariaLabel</code> | <code>string</code>  | Define a string that labels the action to be performed when the user interacts with the button |
| Label   | <code>ariaLabel</code> | <code>string</code>  | Define a string that labels the action to be performed when the user interacts with the button |

{.ds-table}
```

Important thing is to add `{.ds-table}` and one line separator between the table and `{.ds-table}`.

`{.ds-table}` represents css class with styles for the table.

And it results in:

![image](https://user-images.githubusercontent.com/111562742/214527489-c9a737db-2745-452d-9701-8de2e9bb2bda.png)



- do and don't sections
- 
#### Do section
In markdown file:
Results in:

#### Don't section
In markdown file:
Results in:

#### Vertical tabs
- how vertical tabs works and wrapping sections
Vertical tabs are created from `H2` elements (`## in markdown`). What's important, `H2` (`## element`) and elements below this `H2` should be wrapped with `<section></section>` html tags - important thing for scrolling and other visual elements and styles.


TODO: how to create a PR
When you'll finish your work on adding documentation for the component, you need to create a Pull Request. 
Simply go to `branches` and click `New pull request` button which you can find next to your branch name.

After creating a Pull Request you can preview website with your changes:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214502361-7743ad97-28ab-45f8-b041-e811d41a724e.png">


