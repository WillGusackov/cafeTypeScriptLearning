export interface MenuItem {
    id: number;
    name: string;
    course: "starter" | "main" | "dessert";
    price: number;
    nutrition: {
        calories: number;
        allergens: string[];
    };
    discountPercent?: number; // Optional property for discount percentage
    availableFrom?: Date; // Optional property for availability date
}

export interface Seasonal extends MenuItem {
    availableFrom: Date;
    discountPercent: number;
}

export interface ComboDeal {
    id: number;
    name: string;
    items: MenuItem[];
    price: number;
}

export type courseList = ("starter" | "main" | "dessert")[];
