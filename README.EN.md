# 📱 Pokédex App

Mobile app built with **React Native + Expo** to view, search, favorite, and organize Pokémon into custom PC Boxes. Notifications are displayed at the top of the screen when Pokémon are nearby.

---

## 🚀 Features

* 🔍 Search Pokémon by name or number
* ❤️ Favorite Pokémon
* 📦 Create custom Boxes by type
* ➕ Add/remove Pokémon from Boxes
* 📍 Nearby Pokémon section (with local notification)
* 🔔 Notifications via `expo-notifications`
* 📆 Local storage with `AsyncStorage`
* 🌐 High-resolution official images
* 🧼 Responsive UI based on Figma design

---

## ⚙️ Performance Optimizations

* ♻️ `FlatList` with `getItemLayout`, `initialNumToRender`, and `windowSize` for large lists
* 📦 Toast feedback via reusable `ToastContext`
* 📱 `SafeAreaView` for notch-safe display
* 💡 Screen logic isolated in `viewmodels` (MVVM pattern)

---

## ▶️ Demo Video

🎥 [Watch the app demo](https://drive.google.com/file/d/1_Y0pZ5-uMihz4wquIFKFCrK0kgTxEaEM/view?usp=sharing)

---

## 📸 Screenshots

| Home Screen                        | Details                        | Favorites                       | Boxes                        | Add Box                             |
| ---------------------------------- | ------------------------------ | ------------------------------- | ---------------------------- | ----------------------------------- |
| ![](pokedex/docs/tela-inicial.png) | ![](pokedex/docs/detalhes.png) | ![](pokedex/docs/favoritos.png) | ![](pokedex/docs/pc-box.png) | ![](pokedex/docs/botao-add-box.png) |

---

## 🎨 Figma Design

🖌️ [View the layout on Figma](https://www.figma.com/design/ygxXxbzVov0mS3BQlwaFv5/Untitled?node-id=0-1&t=dCymtDfgUzldBy47-1)

---

## 🧠 Architecture

Follows **Clean Architecture** structure:

```
src/
├── components/       # Reusable visual components
├── context/          # Context API and global services (Toast, Notifications)
├── data/             # Repositories and data sources
│   ├── datasources/
│   └── repositories/
├── domain/           # Domain models and types
├── services/         # External services (notifications)
├── theme/            # Styles, tokens, spacing
├── viewmodels/       # Screen logic (MVVM pattern)
```

---

## 🧪 Tests

```bash
npm test
```

* ✅ `FavoriteRepository.test.ts`
* ✅ `PCBoxRepository.test.ts`
* ⏳ UI tests planned using `@testing-library/react-native` and `jest-expo`

---

## 📦 Installation

```bash
git clone https://github.com/PedroNestJp/pockedex-expo-app.git
cd pockedex-expo-app/pokedex
npm install
npx expo start
```

> 💡 Make sure to allow notifications on your device.

---

## 🛠️ Technologies

* Expo SDK + React Native
* TypeScript
* React Query
* Expo Router
* AsyncStorage
* Expo Notifications
* @testing-library/react-native + Jest

---

## 📄 License

This project is intended for technical demonstration purposes only.

---

## ✨ Author

Developed by **Pedro Silva** 💻
🔗 [LinkedIn](https://www.linkedin.com/in/pedronest)
