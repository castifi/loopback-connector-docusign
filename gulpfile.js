'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

let typescript;
let projectTS;
let tsProject;
let sourcemaps;
gulp.task('build:typescript', () => {
  if (!typescript) {
    typescript = require('gulp-typescript');
    projectTS = require('typescript');
    sourcemaps = require('gulp-sourcemaps');
  }
  if (!tsProject) {
    tsProject = typescript.createProject('tsconfig-main.json', {rootDir: 'src', typescript: projectTS});
  }
  let tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

  return tsResult.js
          .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/src/', destPath: 'build'}))
          .pipe(gulp.dest('build'));
});

var tsProjectTests;
gulp.task('build:typescript:tests', () => {
  if (!typescript) {
    typescript = require('gulp-typescript');
    projectTS = require('typescript');
    sourcemaps = require('gulp-sourcemaps');
  }
  if (!tsProjectTests) {
    tsProjectTests = typescript.createProject('tsconfig-tests.json', {rootDir: 'src', typescript: projectTS});
  }
  var tsResult = tsProjectTests.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProjectTests));

  return tsResult.js
          .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/src/', destPath: 'build'}))
          .pipe(gulp.dest('build'));
});

var yaml;
gulp.task('build:yaml', () => {
  if (!yaml) {
    yaml = require('gulp-yaml');
  }
  return gulp.src('src/**/*.yaml')
          .pipe(yaml({
            schema: 'DEFAULT_SAFE_SCHEMA'
          }))
          .pipe(gulp.dest('build'));
});

gulp.task('build:tests', ['build:typescript:tests']);

gulp.task('build:dev', ['build:typescript', 'build:tests']);

let del;
gulp.task('clean', () => {
  if (!del) {
    del = require('del');
  }
  return del(['build']);
});

gulp.task('watch:dev', () => {
  gulp.watch(['src/**/*.ts'], ['build:typescript']);
  gulp.watch(['build/**/**'], ['run']);
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.ts'], ['build:typescript']);
});

let mocha;
let fs;
let processEnv;
let dotenv;
let env;
gulp.task('test', () => {
  if (!mocha) {
    mocha = require('gulp-mocha');
  }
  if (!fs) {
    fs = require('fs');
  }
  if (!env) {
    processEnv = require('gulp-process-env');
    dotenv = require('dotenv');
    // TODO: Read in .env file to json
    let buffer;
    try {
      buffer = fs.readFileSync(`${__dirname}/.env`);
    } catch (e) {
      console.log(`No .env file found`);
    }
    const envFile = dotenv.parse(buffer);
    env = processEnv(envFile);
  }
  return gulp.src(['build/**/tests/*.test.js'], {read: false})
          .pipe(env)
          .pipe(mocha())
          .pipe(env.restore());
});

let tsLint;
let yamlLint;
gulp.task('lint', () => {
  if (!tsLint || !yamlLint) {
    tsLint = require('gulp-tslint');
    yamlLint = require('gulp-yaml-validate');
  }
  gulp.src('src/**/*.ts')
    .pipe(tsLint())
    .pipe(tsLint.report());
  gulp.src('src/**/*.yaml')
    .pipe(yamlLint({safe: true, space: 2}));
});

let Foreman;
gulp.task('run', () => {
  if (!Foreman) {
    Foreman = require('gulp-nf').Foreman;
  }
  Foreman({
    cwd: `${process.cwd()}/`,
    procFile: `${process.cwd()}/Procfile`,
    envFile: `${process.cwd()}/.env`
  });
});

gulp.task('build', (callback) => {
  runSequence('clean', ['build:typescript', 'build:yaml'], callback);
});

gulp.task('default', ['build']);
