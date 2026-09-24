// ---------------------------------------------------------------
// 1. THE MENU
// ---------------------------------------------------------------

import { availableMemory } from "process";
import { MenuItem, Seasonal, ComboDeal, courseList } from "./menuTypes";

// TS: These three objects share a structure - declare an interface (call it
//     MenuItem) that describes it, and annotate each declaration with it.
//     Note that 'nutrition' is a nested object, so it needs a nested type.
const soup : MenuItem = {
  id: 1,
  name: "Roast Tomato Soup",
  course: "starter",
  price: 5.5,
  nutrition: {
    calories: 180,
    allergens: ["celery"],
  },
};

const risotto : MenuItem = {
  id: 2,
  name: "Mushroom Risotto",
  // TS: 'course' should only ever be one of three values. Declare a *literal
  //     (union) type* called Course - "starter" | "main" | "dessert" - and use
  //     it as the property's type instead of string. One of the objects below
  //     will then fail to compile. Good.
  // in menuTypes.d.ts, we have defined course as a union type of "starter" | "main" | "dessert", so the following line will cause a compilation error because "desert" is not a valid value for the course property.
  course: "main",
  price: 14.0,
  nutrition: {
    calories: 620,
    allergens: ["milk"],
  },
};

const brownie : MenuItem = {
  id: 3,
  name: "Chocolate Brownie",
  course: "dessert",
  price: 6.0,
  nutrition: {
    calories: 450,
    allergens: ["milk", "eggs", "gluten"],
  },
};

const pasta : Seasonal = {
    id: 4,
    name: "Pasta Carbonara",
    course: "main",
    price: 12.0,
    nutrition: {
      calories: 700,
      allergens: ["milk", "eggs", "gluten"],
    },
    availableFrom: new Date("2026-06-01"),
    discountPercent: 15,
  };

  const chips : Seasonal = {
    id: 5,
    name: "French Fries",
    course: "starter",
    price: 4.0,
    nutrition: {
      calories: 300,
      allergens: ["potatoes"],
    },
    availableFrom: new Date("2026-06-01"),
    discountPercent: 10,
  };

const course : courseList = ["starter", "main", "dessert"];
const seasonalMenu : Seasonal[] = [pasta, chips];
  

// TS: Not every item is on offer, and only some are seasonal. Add two
//     *optional properties* to MenuItem - discountPercent (number) and
//     availableFrom (Date) - and set them on one or two items here. The
//     existing objects that lack them must still compile.
const menu = [soup, risotto, brownie, ...seasonalMenu];

// TS: A combo is a named bundle of menu items sold at a fixed price. Declare a
//     second interface for it (ComboDeal: id, name, items, price).
const lunchCombo : ComboDeal = {
  id: 101,
  name: "Soup & Sweet",
  items: [soup, brownie],
  price: 10.0,
};

const dinnerCombo : ComboDeal = {
  id: 102,
  name: "Risotto & Sweet",
  items: [risotto, brownie],
  price: 18.0,
};
// TS: An order line is *either* a MenuItem or a ComboDeal. Declare a *type
//     alias* for that union (e.g. OrderLine) and use it for the array below.
const currentOrder = [risotto, lunchCombo, soup, dinnerCombo];
function isMenuItem(item: MenuItem | ComboDeal): item is MenuItem {
  return (item as MenuItem).course !== undefined;
}

// ---------------------------------------------------------------

function describe(item: MenuItem | ComboDeal) {
  if (isMenuItem(item)) {
    return `${item.name} (${item.course}) - EUR ${item.price.toFixed(2)}`;
  }
  return `${item.name} (Combo Deal) - EUR ${item.price.toFixed(2)}`;
}

// TS: An OrderLine is a union, so this function must *narrow* the type before
//     it can touch the properties that only one member has. Use the 'in'
//     operator - a ComboDeal has an 'items' property, a MenuItem does not.
function lineTotal(line: MenuItem | ComboDeal) {
  if ("items" in line) {
    return line.price; // Combos are sold at their bundle price.
  }
  return line.price;
}

function orderTotal(lines: (MenuItem | ComboDeal)[]) {
  return lines.reduce((total, line) => total + lineTotal(line), 0);
}

// TS: 'predicate' is a callback - a *higher order function* parameter. Type it
//     as a function signature: (item: MenuItem) => boolean.
function filterMenu(items: MenuItem[], predicate: (item: MenuItem) => boolean) {
  return items.filter(predicate);
}

// TS: 'max' should be an *optional parameter*: when omitted, return every
//     match. Beware - the compiler will complain about comparing a possibly
//     'undefined' value with a number, so handle that case explicitly.
function cheapest(items: MenuItem[], max?: number) {
  const sorted = items.sort((a, b) => a.price - b.price);
  return sorted.slice(0, max);
}

// TS: This function works on any array, not just menu items. Make it
//     *generic*: <T>(data: T[], criteria: (d: T) => boolean) => T | undefined.
function firstMatch<T>(data: T[], criteria: (d: T) => boolean): T | undefined {
  return data.find(criteria);
}

// TS: 'changes' holds *some* of a MenuItem's properties. Use the Partial<>
//     *utility type* rather than declaring a new interface by hand.
function updateItem(item: MenuItem, changes: Partial<MenuItem>) {
  return { ...item, ...changes };
}

// TS: The kitchen ticket needs the name and course of an item, and nothing
//     else - and it must not be modifiable once created. Declare its type by
//     composing two utility types: Readonly<Pick<...>>.
function kitchenTicket(item: MenuItem) {
  return {
    name: item.name,
    course: item.course,
  };
}

// TS: An allergy card is a MenuItem without its nutrition property, but with a
//     'warning' string added. Declare its type with Omit<> and an intersection
//     (&) - see the EventPass example in the Utility Types section.
function allergyCard(item: MenuItem) {
  return {
    id: item.id,
    name: item.name,
    course: item.course,
    price: item.price,
    warning: `Contains: ${item.nutrition.allergens.join(", ")}`,
  };
}

// ---------------------------------------------------------------
// 3. TESTS - these should still produce the same output afterwards.
// ---------------------------------------------------------------

console.log(describe(risotto));
console.log(orderTotal(currentOrder));
console.log(filterMenu(menu, (i) => i.nutrition.calories < 500));
console.log(cheapest(menu, 2));
console.log(cheapest(menu));
console.log(firstMatch(menu, (i) => i.course === "dessert"));
console.log(updateItem(soup, { price: 6.0, discountPercent: 10 }));
console.log(kitchenTicket(brownie));
console.log(allergyCard(brownie));

// TS: The compiler will reject the next line once kitchenTicket returns a
//     Readonly<> type. Leave it commented out with a note explaining why.
// kitchenTicket(brownie).name = "Something else";

// TS: Three more lines below are bugs that only the compiler can see. Once
//     your types are in place, fix each one and note it in your commit message.
console.log(describe(lunchCombo));
console.log(updateItem(soup, { price: 7.00 })); //not a string got rid of quotes
console.log(firstMatch(menu, (i) => i.nutrition.calories < 300)); // nutrition is nested in calories fixed 