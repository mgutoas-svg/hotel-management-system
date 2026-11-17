# 🤝 Guia de Contribuição

Obrigado por considerar contribuir ao **Hotel Management System**! Este documento fornece diretrizes e instruções para contribuir.

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Não tolere assédio ou discriminação
- Críticas construtivas apenas
- Aceite críticas com graça

## 🚀 Como Começar

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/hotel-management-system.git`
3. **Crie uma branch**: `git checkout -b feat/sua-feature`
4. **Faça commits atômicos**: `git commit -m "feat: descrição clara"`
5. **Push para seu fork**: `git push origin feat/sua-feature`
6. **Abra um Pull Request** com descrição detalhada

## 📝 Commitando Código

### Mensagens de Commit

Seguimos **Conventional Commits**:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[footer opcional]
```

**Tipos**:
- `feat:` Nova feature
- `fix:` Bug fix
- `docs:` Documentação
- `style:` Formatação, sem mudança lógica
- `refactor:` Refatoração sem nova feature
- `perf:` Melhoria de performance
- `test:` Testes
- `chore:` Build, deps, config

**Exemplos**:
```
feat(channels): adicionar integração com Expedia
fix(reservations): corrigir bug de overbooking
docs(api): atualizar documentação de autenticação
test(auth): adicionar testes de JWT refresh token
```

## 🧪 Testes

**Requisitos**:
- Mínimo 80% cobertura
- Todos os testes passando
- Sem testes skipped

```bash
# Backend
cd backend
npm run test              # Unitários
npm run test:e2e          # E2E
npm run test:cov          # Cobertura

# Frontend
cd frontend
npm run test              # Jest
npm run test:cov          # Cobertura
```

## 🔍 Code Review

- **Mínimo 2 aprovações** antes de merge
- Linting automático (ESLint + Prettier)
- Cobertura não pode diminuir
- Sem comentários de debug (`console.log`, `debugger`)
- Tipos TypeScript corretos (sem `any`)

## 📐 Padrões de Código

### Backend (NestJS)
```typescript
// ✅ BOM
@Injectable()
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}

// ❌ RUIM
export class UserService {
  async findById(id: string): Promise<any> {
    // sem dependency injection
  }
}
```

### Frontend (React)
```typescript
// ✅ BOM
export const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  return <div>{user.name}</div>;
};

// ❌ RUIM
export const UserCard = ({ user }) => {
  return <div>{user.name}</div>;
};
```

## 🔐 Segurança

**Não commite**:
- Senhas ou tokens
- Chaves privadas
- Dados pessoais
- Configurações de produção

**Use**:
- `.env.example` para variáveis
- `secrets` em CI/CD
- Validação em toda entrada
- Sanitização de dados

## 📚 Documentação

Novas features devem incluir:
- Comentários no código (se lógica complexa)
- Testes (casos de uso e edge cases)
- Documentação de API (JSDoc)
- Atualizar README se necessário

Exemplo:
```typescript
/**
 * Calcula a ocupação média por período
 * @param propertyId - ID da propriedade
 * @param startDate - Data inicial (ISO string)
 * @param endDate - Data final (ISO string)
 * @returns Taxa de ocupação média (0-100)
 */
async getOccupancyRate(
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  // implementação
}
```

## ✅ Checklist antes de PR

- [ ] Código segue padrões de style (ESLint passa)
- [ ] Testes escritos e passando
- [ ] Cobertura ≥ 80%
- [ ] Documentação atualizada
- [ ] Sem `console.log` ou `debugger`
- [ ] Sem tipos `any` (ou justificados)
- [ ] Commits atômicos com mensagens claras
- [ ] Branch atualizado com `main`
- [ ] Descrição clara no PR

## 🐛 Reportando Bugs

Use GitHub Issues com template:

```markdown
## Descrição
Descrição clara do bug

## Como reproduzir
1. Passo 1
2. Passo 2
3. ...

## Resultado esperado
O que deveria acontecer

## Resultado atual
O que realmente acontece

## Ambiente
- OS: (Windows, Linux, macOS)
- Node: (versão)
- Browser: (Chrome, Firefox, etc)
```

## 💡 Sugerindo Features

Abra uma Issue com template de feature request:

```markdown
## Descrição
Descrição da feature desejada

## Problema que resolve
Qual problema isso resolve?

## Solução proposta
Como você imagina isso implementado?

## Alternativas consideradas
Outras abordagens?

## Contexto adicional
Screenshots, exemplos, links?
```

## 📞 Dúvidas?

- Abra uma Issue
- Comece com `[QUESTION]` no título
- Seja específico

---

**Obrigado por contribuir!** 🎉
