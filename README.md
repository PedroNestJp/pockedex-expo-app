# 📱 Pokedéx App

Aplicativo mobile desenvolvido em React Native com Expo, que permite visualizar, buscar, favoritar e organizar Pokémons em Boxes personalizadas. Notificacoes são enviadas quando Pokémons aparecem por perto.

---

## 🚀 Funcionalidades

* 🔍 Buscar Pokémons por nome ou número
* ❤️ Favoritar Pokémons
* 📆 Criar Boxes com tipos definidos
* ➕ Adicionar/remover Pokémons nas Boxes
* 📍 Seção de Pokémons por perto (com notificação)
* 🔔 Notificações locais usando `expo-notifications`
* 📂 Persistência com `AsyncStorage`
* 🌐 Imagens oficiais em alta resolução
* 🧼 UI seguindo design do Figma (modo grid responsivo)

---

## 📸 Screenshots

| Tela Inicial                | Detalhes                    | Favoritos                   | Boxes                       |
| --------------------------- | --------------------------- | --------------------------- | --------------------------- |
| ![](./docs/screenshot1.png) | ![](./docs/screenshot2.png) | ![](./docs/screenshot3.png) | ![](./docs/screenshot4.png) |

---

## 🧠 Arquitetura

Aplicado **Clean Architecture**:

```
src/
├── components/       # Componentes visuais reutilizáveis
├── context/          # Context API e serviços globais
├── data/             # Repositórios e fontes de dados
│   ├── datasources/
│   └── repositories/
├── domain/           # Modelos e tipos do domínio
├── services/         # Serviços externos (notificações)
├── theme/            # Estilos, tokens, espaçamentos
├── viewmodels/       # Lógica de tela (hooks)
```

---

## 🧪 Testes

```bash
npm test
```

* ✅ `FavoriteRepository.test.ts`
* ✅ `PCBoxRepository.test.ts`
* ⏳ Testes adicionais podem ser implementados com `@testing-library/react-native` e `jest-expo`.

---

## 📦 Instalação

```bash
git clone https://github.com/seu-usuario/pokedex-app.git
cd pokedex-app
npm install
npx expo start
```

> 💡 Certifique-se de aceitar permissões de notificação no dispositivo.

---

## 📱 Tecnologias

* React Native (com Expo SDK)
* TypeScript
* AsyncStorage
* Expo Notifications
* React Query
* React Navigation (expo-router)
* @testing-library + Jest

---

## 📄 Licença

Este projeto é apenas para fins de demonstração técnica.

---

## ✨ Autor

Desenvolvido por **Mateus Silva** 💻
[LinkedIn](https://www.linkedin.com/in/seu-perfil) | [GitHub](https://github.com/seu-usuario)
