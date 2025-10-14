/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos (incluye extras usados en el repo)
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'perf',
        'style',
        'test',
        'ci',
        'build',
        'revert',
        'ui',
        'restore'
      ],
    ],
    // Scopes sugeridos para este repo
    'scope-enum': [
      2,
      'always',
      [
        'app',
        'components',
        'lib',
        'contexts',
        'hooks',
        'scripts',
        'docs',
        'styles',
        'public',
        'api',
        'config',
        'ci',
        'deps'
      ],
    ],
    // Permite commits sin scope (desactiva obligatoriedad)
    'scope-empty': [0],
    // Scopes en kebab-case
    'scope-case': [2, 'always', 'kebab-case'],
    // Máximo 72 caracteres en el encabezado
    'header-max-length': [2, 'always', 72],
    // No forzar casing del asunto y sin punto final
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    // Línea en blanco antes de body/footer (aviso)
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
  },
};
