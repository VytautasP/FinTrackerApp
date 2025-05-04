export interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    color: string;
}

//icons from MaterialCommunityIcon: https://static.enapter.com/rn/icons/material-community.html
export const categories : CategoryItem[] = [
    { id: '1', name: 'Uncategorized', icon: 'help-circle-outline', color: '#B0BEC5' }, // Grey
    { id: '2', name: 'Shopping & Services', icon: 'basket', color: '#FF8A65' }, // Deep Orange Light
    { id: '3', name: 'Income', icon: 'cash-plus', color: '#4CAF50' }, // Green
    { id: '4', name: 'Entertainment', icon: 'movie-open', color: '#BA68C8' }, // Purple Light
    { id: '5', name: 'Food', icon: 'food-apple', color: '#FFD54F' }, // Amber Light
    { id: '6', name: 'Transport', icon: 'car', color: '#64B5F6' }, // Blue Light
    { id: '7', name: 'Children', icon: 'human-child', color: '#FFF176' }, // Yellow Light
    { id: '8', name: 'Health & Beauty', icon: 'heart-pulse', color: '#F06292' }, // Pink Light
    { id: '9', name: 'Insurance', icon: 'shield-check', color: '#4DB6AC' }, // Teal Light
    { id: '10', name: 'Other Expenses', icon: 'dots-horizontal-circle-outline', color: '#90A4AE' }, // Blue Grey Light
    { id: '11', name: 'Vacations & Travel', icon: 'airplane', color: '#7986CB' }, // Indigo Light
    { id: '12', name: 'Investing & Saving', icon: 'chart-line', color: '#81C784' }, // Green Light
    { id: '13', name: 'Pet Care', icon: 'paw', color: '#A1887F' }, // Brown Light
];

export function getCategoryById(id: string): CategoryItem {
    const category = categories.find(category => category.id === id);
    if (!category) {
        return categories[0];
    }
    return category;
}