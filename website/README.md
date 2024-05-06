# How to add component documentation

## Create a new branch

https://github.com/sl-design-system/components/branches

Create a new branch:

<img alt="new branch image" src="https://user-images.githubusercontent.com/111562742/214255469-ce8a7d79-cf6f-41f2-a4b7-7fca8b829a43.png">



New branch should use `main` branch as a source:

<img width="443" alt="creating branch image" src="https://user-images.githubusercontent.com/111562742/214253485-d4a4bd36-3226-4bd1-a5f9-f82a77e09446.png">

Let’s name our new branch like `docs/319-button-documentation` or something similar (more info: https://github.com/sl-design-system/components/blob/main/CONTRIBUTING.md). The number should be taken from the number of the story in the github project when available.

After creating our new branch, let’s open this branch and check the structure, where we are placing our component’s documentation.

The documentation for every component should be kept in separated directory in `categories/components` directory
![image](https://user-images.githubusercontent.com/111562742/214264218-83a2d908-6523-4ed5-90a2-c58a856c569a.png) 

eg.:
  - Button should have path like `docs/website/src/site/categories/components/button`,

  - Checkbox should have path like `docs/website/src/site/categories/components/checkbox` etc.

## Component's files structure

Every component directory consists of **7 files**, like for a **button** directory there will be:

![image](https://user-images.githubusercontent.com/111562742/214264654-af3891e9-8814-45e0-b550-fc57d2f5af16.png)


- `accessibility.md` - file contains content for the **“Accessibility”** tab for a button component
- `button.json` - contains information about layout and tags, **layout** should be the same for every component and **tags** should contain component name like "button" in this example
- `button.md` - file contains informations such like **title**, which contains component name and **description**, which contains short component description
- `code.md` - file contains content for the **“Code”** tab for a button component
- `overview.md` - file contains content for the **“Overview”** tab for a button component
- `specs.md` - file contains content for the **“Specs”** tab for a button component
- `usage.md` - file contains content for the **“Usage”** tab for a button component

More information about component's files content you can find below.

## Component json file

### `button.json` file

![image](https://user-images.githubusercontent.com/111562742/220635927-b3f03b5f-9d4b-4085-94d7-bd49b2ffcd6d.png)

`button.json` file consists of **layout**, **tags** and **componentTagName** elements. Layout should be the same for every component `"categories/components/components.njk"` and tags should contain component name like `"button"` in this example. If there will be a component with more complex name like `button bar`, **tags** element will contain `"button-bar"` and name of the file should be the same (`button-bar.json`). Please use kebab case for complex component names. The **componentTagName** should contain tag name of the component, in this case `"sl-button"`. The **componentTagName** is used for generating table with component's properties.

## Component markdown files

> Please, keep in mind that indentation in markdown files is an important thing.

Markdown files contain YAML header with arguments, which are used for different purposes such like navigation, page title, layout etc.

### `button.md` file
YAML header in `button.md` (`component.md`) file contains:

```
---
title: Button
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
layout: "categories/components/components.njk"
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

  - `layout` for components should always contain `"categories/components/components.njk"`
  - `tags` should always contain `component` for `component.md` files
  - `eleventyNavigation` contains options used for navigation on our website, `parent` should be `Components` and `order` represents order of showing components in our navigation (Button order is 2, so we can find it on the second place under `Components` navigation item):   

      ![image](https://user-images.githubusercontent.com/111562742/214509125-5fbb9df4-f869-4207-8bb4-a2bc3bd7b191.png)


### `overview.md` file

```
---
title: Button overview
tags: overview
eleventyNavigation:
  parent: Button
  key: ButtonOverview
---
```

  - `title` component overview title like `Component overview` (`Button overview` in this case)
    
  - `tags` for `overview.md` files should contain `overview` value, which is used for **Overview tab** content rendering
    
  - `eleventyNavigation` contains options used for the navigation on our website, `parent` should be the name of component (`Button` in this case) and `key` like `ComponentOverview` (`ButtonOverview` in this case)

This file contains elements, which will be rendered as a **Overview tab** content (in our example button's component tab content).

#### Vertical tabs
Vertical tabs are created from `H2` elements (`## in markdown`). What's important, `H2` (`## element`) and elements below that `H2` should be wrapped with `<section></section>` html tags - important thing for scrolling and other visual elements and styles.

Example:
```
<section>

## Lorem ipsum dolor sit amet
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Related
Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
```

which results in the output documentation file:
![image](https://user-images.githubusercontent.com/111562742/214551216-98bf7112-09e1-4f5e-8fc6-156124ca61a4.png)

#### Component example with code

An element added to show component live example and example component code.

````
<div class="ds-example">

<sl-button fill="default" variant="primary" size="md">Button</sl-button>

</div>

<div class="ds-code">

  ```html
  <sl-button fill="default" variant="primary" size="md">Button</sl-button>
  ```

</div>
````

Results in:

![image](https://user-images.githubusercontent.com/111562742/214560649-3946b414-0067-4564-ba28-e03d3e3d79cd.png)


#### Images - how to add and use

Images should be stored in the `assets` directory:

![image](https://user-images.githubusercontent.com/111562742/214331361-fa025dbf-7e9d-4242-88d2-d621c1ab4460.png)

First we need to upload files which we need:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214331556-d7701709-4b0d-4af8-ad68-d036c77f6e0a.png">

![image](https://user-images.githubusercontent.com/111562742/214331641-b929f553-829e-441f-b02f-2d8cedd33dd2.png)

and then we can use them in our markdown files as follows (please remember about commiting changes first):

`![Alt text example](/assets/images/example-dont.svg "don't picture")` where `Alt text example` is an alternative text (`alt` attribute), more: https://www.w3.org/TR/WCAG20-TECHS/H37.html and `"don't picture"` represents a title.


#### "Do" part

An element added to show how we recommend using our component.

In markdown file:
```
<div class=ds-do-dont>

<div class="ds-success">

![Alt text example](/assets/images/example-do.svg "do picture"){.ds-do-dont__picture}

<div class="ds-success__content">

### Do

Place text here

</div>

</div>

</div>
```
Results in:

![image](https://user-images.githubusercontent.com/111562742/214552688-ab9eedbb-b35b-4a0b-852f-d491a0ebc243.png)


#### "Don't" part

An element added to show how we not recommend using our component.

In markdown file:
```
<div class=ds-do-dont>

<div class="ds-danger">

![Alt text example](/assets/images/example-dont.svg "don't picture"){.ds-do-dont__picture}

<div class="ds-danger__content">

### Don't

Place text here

</div>

</div>

</div>
```

Results in:

![image](https://user-images.githubusercontent.com/111562742/214552762-642429e6-c600-4e1d-b69a-572ffc97ab49.png)


#### Do and don't parts together

```
<div class=ds-do-dont>

<div class="ds-success">

![Alt text example](/assets/images/example-do.svg "do picture"){.ds-do-dont__picture}

<div class="ds-success__content">

### Do

Place text here

</div>

</div>


<div class="ds-danger">

![Alt text example](/assets/images/example-dont.svg "don't picture"){.ds-do-dont__picture}

<div class="ds-danger__content">

### Don't

Place text here

</div>

</div>

</div>
```

Do and don't elements should be wrapped together with `<div class=ds-do-dont></div>`.


#### Table

Table with component's properties is generated automatically and we need to add only one line to the markdown file eg. in the `overview.md`:

`{% include "../component-table.njk" %}`

An important thing is to add `componentTagName` to json file as mentioned [before](#component-json-file).

![image](https://user-images.githubusercontent.com/111562742/220834896-4eeeae8b-1dc5-40e1-9131-b50da0312e38.png)

The line with including generated tables should not be wrapped with `<section></section>`, because it's already done in the template with generating component's properties tables.


If we want we can also add a table in the markdown file with our own content. Table in the markdown file looks as follows:

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



To sum up the whole **overview.md** file structure:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214557389-0b87338d-93a8-4d34-8354-cb76eeb92698.png">


<img alt="image" src="https://user-images.githubusercontent.com/111562742/214557186-ee7b89bf-fda3-4330-ad36-b06cce812cef.png">

<img alt="image" src="https://user-images.githubusercontent.com/111562742/220863895-d455aef9-436a-4472-be35-83fb0eb6f5c4.png">



All elements like **do** and **don't** part, **code** example, **table** etc. can be used in other component's markdown files as well.

When you want to save/commit your changes you should use option as follows:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214265893-3f964887-8e12-4774-a40a-e70c8da0775e.png">

Write proper commit message and use option 
> Commit directly to the `docs/your-branch-name` branch 

and click `Commit changes` button.


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

Content for the `accessibility.md` file should consists of sections (`<section></section>`), similar to `overview.md` file and can be build in the same [way](#vertical-tabs).

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

Content for the `code.md` file should consists of sections (`<section></section>`), similar to `overview.md` file and can be build in the same [way](#vertical-tabs).

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

  - `title` component specs title like `Component specs` (`Button specs` in this case)
    
  - `tags` for `specs.md` files should contain `specs` value, which is used for **Specs tab** content rendering
    
  - `eleventyNavigation` which are options used for the navigation on our website, `parent` should be the name of component (`Button` in this case) and `key` like `ComponentSpecs` (`ButtonSpecs` in this case)

Content for the `specs.md` file should consists of sections (`<section></section>`), similar to `overview.md` file and can be build in the same [way](#vertical-tabs).

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

  - `title` component usage title like `Component usage` (`Button usage` in this case)
    
  - `tags` for `usage.md` files should contain `usage` value, which is used for **Usage tab** content rendering
    
  - `eleventyNavigation` which are options used for the navigation on our website, `parent` should be the name of component (`Button` in this case) and `key` like `ComponentUsage` (`ButtonUsage` in this case)

Content for the `usage.md` file should consists of sections (`<section></section>`), similar to `overview.md` file and can be build in the same [way](#vertical-tabs).

## Add documentation for a totally new component

If you'll need to add files structure for other component such as `radio` component for example, you should follow these steps:
- Please check if you're on the right branch
- Go to the directory `categories/components`
 
  ![image](https://user-images.githubusercontent.com/111562742/214264218-83a2d908-6523-4ed5-90a2-c58a856c569a.png) 

- Click `Add file` button and then `Create new file` to add a `radio` directory and `radio.json` file inside.

  ![image](https://user-images.githubusercontent.com/111562742/214283301-fa79efe4-a8d6-4c85-8a1f-e5f8c6b97263.png)


  https://user-images.githubusercontent.com/111562742/214285713-44396c59-8fd3-4cac-bd57-0c7989733e36.mov

and then you can add other files, which are listed [here](#components-files-structure) and their content as well.


## How to create a Pull Request

When you'll finish your work on adding documentation for the component, you need to create a Pull Request. 
Simply go to `branches` and click `New pull request` button which you can find next to your branch name.

After creating a Pull Request you can preview website with your changes:

<img alt="image" src="https://user-images.githubusercontent.com/111562742/214502361-7743ad97-28ab-45f8-b041-e811d41a724e.png">


