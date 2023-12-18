function findCategory(object)
{
    if (object === null)
        return null
    else if (object.className === "category")
        return object
    else
        return findCategory(object.parentNode)
}

export default findCategory