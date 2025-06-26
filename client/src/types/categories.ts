export type MainCategory = {
    id: string
    name: string
    color: string
    subcategories: CategoryData[]
}

export type CategoryData = {
    id: string
    name: string
    score: number
    isCustom?: boolean
    mainCategory: string
}

export type CategoryValue = {
    name: string;
    value: number;  // 0-10
    color: string;  // HEX
};