# 📱 Pokedéx App

Aplicativo mobile desenvolvido com **React Native + Expo**, que permite visualizar, buscar, favoritar e organizar Pokémons em Boxes personalizadas. Notificações são exibidas no topo da tela quando Pokémons aparecem por perto.

---

## 🚀 Funcionalidades

* 🔍 Buscar Pokémons por nome ou número
* ❤️ Favoritar Pokémons
* 📦 Criar Boxes com tipos definidos
* ➕ Adicionar/remover Pokémons nas Boxes
* 📍 Exibir Pokémons por perto (com notificação local)
* 🔔 Notificações usando `expo-notifications`
* 📎 Armazenamento local com `AsyncStorage`
* 🌐 Imagens oficiais em alta resolução
* 🧼 UI responsiva seguindo design do Figma

---

## ⚙️ Otimizações implementadas

* ♻️ `FlatList` com `getItemLayout`, `initialNumToRender` e `windowSize` para listas grandes
* 📦 Reutilização de `ToastContext` para feedback leve e elegante
* 📱 Uso consistente de `SafeAreaView` para compatibilidade com dispositivos com notch
* 💡 Separação de lógica em `viewmodels` (hooks) seguindo padrão MVVM

---

## ▶️ Demonstração em vídeo

🎥 [Clique aqui para assistir à demonstração do app](https://drive.google.com/file/d/1_Y0pZ5-uMihz4wquIFKFCrK0kgTxEaEM/view?usp=sharing)

---

## 📸 Screenshots

| Tela Inicial                       | Detalhes                       | Favoritos                       | Boxes                        | Adicionar Box                       |
| ---------------------------------- | ------------------------------ | ------------------------------- | ---------------------------- | ----------------------------------- |
| ![](pokedex/docs/tela-inicial.png) | ![](pokedex/docs/detalhes.png) | ![](pokedex/docs/favoritos.png) | ![](pokedex/docs/pc-box.png) | ![](pokedex/docs/botao-add-box.png) |

---

## 🎨 Design no Figma

🖌️ [Ver layout no Figma](https://www.figma.com/design/ygxXxbzVov0mS3BQlwaFv5/Untitled?node-id=0-1&t=dCymtDfgUzldBy47-1)

---

## 🧠 Arquitetura

Estruturado com **Clean Architecture**:

```
src/
├── components/       # Componentes visuais reutilizáveis
├── context/          # Context API e serviços globais (Toast, Notifications)
├── data/             # Repositórios e fontes de dados
│   ├── datasources/
│   └── repositories/
├── domain/           # Modelos e tipos do domínio
├── services/         # Serviços externos (notificações)
├── theme/            # Estilos, tokens, espaçamentos
└── viewmodels/       # Lógica de tela e hooks (MVVM)
```

---

## 🧪 Testes

```bash
npm test
```

* ✅ `FavoriteRepository.test.ts`
* ✅ `PCBoxRepository.test.ts`
* ⏳ Cobertura de tela com `@testing-library/react-native` pode ser expandida

---

## 📦 Instalação e execução

```bash
git clone https://github.com/PedroNestJp/pockedex-expo-app.git
cd pockedex-expo-app/pokedex
npm install
npx expo start
```

> 💡 Certifique-se de aceitar permissões de notificação no dispositivo.

---

## 🛠️ Tecnologias utilizadas

* Expo SDK + React Native
* TypeScript
* React Query
* Expo Router
* AsyncStorage
* Expo Notifications
* @testing-library/react-native + Jest

---

## 📄 Licença

Projeto desenvolvido apenas para fins de demonstração técnica.

---

## ✨ Autor

Desenvolvido por **Pedro Silva** 💻
🔗 [LinkedIn](https://www.linkedin.com/in/pedronest)
