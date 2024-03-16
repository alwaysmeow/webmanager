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
    const categoryList = document.querySelectorAll(".category-list")[0]

    categoryList.classList.add("no-animation");
    setTimeout(() => {
        categoryList.classList.remove("no-animation");
    }, 500);
}