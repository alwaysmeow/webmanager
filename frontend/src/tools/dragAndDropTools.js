export function findCategory(object)
{
    if (object.id === "root")
        return null
    else if (object.classList.contains("category"))
        return object
    else
        return findCategory(object.parentNode)
}

export async function blockCategoriesAnimation()
{
    const categoryList = document.querySelectorAll(".category");
    const categoryArray = Array.from(categoryList);

    categoryArray.forEach((element) => {
        element.classList.add("no-animation");
        setTimeout(() => {
            element.classList.remove("no-animation");
        }, 500);
    });
}