/*
 * File: Wordle.js
 * -----------------
 * This program implements the Wordle game.
 */
"use strict";
/**
 * GAME RULES CONSTANTS
 * ---------------------
 */
const NUM_LETTERS = 5;  // The number of letters in each guess 
const NUM_GUESSES = 6;  // The number of guesses the player has to win

//const { _DICTIONARY } = require('./Dictionary');
//const { _COMMON_WORDS } = require('./Common');


/**
 * SIZING AND POSITIONING CONSTANTS
 * --------------------------------
 */
const SECTION_SEP = 32; // The space between the grid, alert, and keyboard sections
const GUESS_MARGIN = 8; // The space around each guess square
const GWINDOW_WIDTH = 400;  // The width of the GWindow

// The size of each guess square (computed to fill the entire GWINDOW_WIDTH)
const GUESS_SQUARE_SIZE =
  (GWINDOW_WIDTH - GUESS_MARGIN * 2 * NUM_LETTERS) / NUM_LETTERS;

// Height of the guess section in total
const GUESS_SECTION_HEIGHT =
  GUESS_SQUARE_SIZE * NUM_GUESSES + GUESS_MARGIN * NUM_GUESSES * 2;

// X and Y position where alerts should be centered
const ALERT_X = GWINDOW_WIDTH / 2;
const ALERT_Y = GUESS_SECTION_HEIGHT + SECTION_SEP;

// X and Y position to place the keyboard
const KEYBOARD_X = 0;
const KEYBOARD_Y = ALERT_Y + SECTION_SEP;

// GWINDOW_HEIGHT calculated to fit everything perfectly.
const GWINDOW_HEIGHT = KEYBOARD_Y + GKeyboard.getHeight(GWINDOW_WIDTH);



/**
 * STYLISTIC CONSTANTS
 * -------------------
 */
const COLORBLIND_MODE = false; // If true, uses R/G colorblind friendly colors

// Background/Border Colors
const BORDER_COLOR = "#3A3A3C"; // Color for border around guess squares
const BACKGROUND_DEFAULT_COLOR = "#121213";
const KEYBOARD_DEFAULT_COLOR = "#818384";
const BACKGROUND_CORRECT_COLOR = COLORBLIND_MODE ? "#E37E43" : "#618C55"; 
const BACKGROUND_FOUND_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#B1A04C";
const BACKGROUND_WRONG_COLOR = "#3A3A3C";

// Text Colors
const TEXT_DEFAULT_COLOR = "#FFFFFF";
const TEXT_ALERT_COLOR = "#B05050";
const TEXT_WIN_COLOR = COLORBLIND_MODE ? "#94C1F6" : "#618C55";
const TEXT_LOSS_COLOR = "#B05050";

// Fonts
const GUESS_FONT = "700 36px HelveticaNeue";
const ALERT_FONT = "700 20px HelveticaNeue";


/**
 * Accepts a KeyboardEvent and returns
 * the letter that was pressed, or null
 * if a letter wasn't pressed.
 */
function getKeystrokeLetter(e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return null;
  const key = e.key.toLowerCase();

  if (!/^[a-z]$/.exec(key)) return null;

  return key;
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * enter (or return), and false otherwise.
 */
function isEnterKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Enter" || e.code === "Return")
  );
}

/**
 * Accepts a KeyboardEvent and returns true
 * if that KeyboardEvent was the user pressing
 * backspace (or delete), and false otherwise.
 */
function isBackspaceKeystroke(e) {
  return (
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    (e.code === "Backspace" || e.code === "Delete")
  );
}

/**
 * Accepts a string, and returns if it is a valid English word.
 */
function isEnglishWord(str) {
  return _DICTIONARY.has(str) || _COMMON_WORDS.has(str);
}

/**
 * Returns a random common word from the English lexicon,
 * that is NUM_LETTERS long.
 * 
 * Throws an error if no such word exists.
 */
function getRandomWord() {
  const nLetterWords = [..._COMMON_WORDS].filter(
    (word) => word.length === NUM_LETTERS
  );

  if (nLetterWords.length === 0) {
    throw new Error(
      `The list of common words does not have any words that are ${NUM_LETTERS} long!`
    );
  }

  return nLetterWords[randomInteger(0, nLetterWords.length)];
}

let state = {
    guesses: [], // 每次的猜测
    currentGuess: '', // 当前用户输入的猜测
    secretWord: '', // 需要猜测的单词
    gameOver: false, // 游戏是否结束
    alert: '', // 提示信息
    maxGuesses: 6, // 最大尝试次数
    keyboard: null,
};

/** Main Function */
function Wordle() {
  const gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
  
  state.secretWord = getRandomWord();  // 从字典中获取随机单词
  alert(state.secretWord );
  state.guesses = [];
  state.currentGuess = '';
  state.gameOver = false;
  state.alert = '';
  if (!state.keyboard) {
        state.keyboard = GKeyboard(KEYBOARD_X, KEYBOARD_Y, GWINDOW_WIDTH, TEXT_DEFAULT_COLOR, KEYBOARD_DEFAULT_COLOR);
        setupKeyboardEvents(state.keyboard, gw);
    }
  
  // const keyboard=GKeyboard(KEYBOARD_X, KEYBOARD_Y, GWINDOW_WIDTH, TEXT_DEFAULT_COLOR, KEYBOARD_DEFAULT_COLOR);
  //setupKeyboardEvents(keyboard, gw);
  // gw.add(keyboard);
  draw(gw);

  
  
  // TODO: Implement Wordle!
}

function draw(gw) {
    gw.clear();  // 清空窗口
    // 绘制猜测内容和提示信息
    for (let i = 0; i < NUM_GUESSES; i++) {
        //const guess = state.guesses[i];
        //const status = getLetterStatus(guess, state.secretWord);  // 获取字母状态
        const y = i * (GUESS_SQUARE_SIZE + GUESS_MARGIN * 2) + GUESS_MARGIN;
        const guessRow = createGuessRow("", y, BACKGROUND_DEFAULT_COLOR,status);  // 使用状态颜色绘制
        gw.add(guessRow);
    }
    for (let i = 0; i < state.guesses.length; i++) {
        const guess = state.guesses[i];
        
        const status = getLetterStatus(guess, state.secretWord);  // 获取字母状态
        //alert(status);
        const y = i * (GUESS_SQUARE_SIZE + GUESS_MARGIN * 2) + GUESS_MARGIN;
        const guessRow = createGuessRow(guess.split(''), y, BACKGROUND_DEFAULT_COLOR,status);  // 使用状态颜色绘制
        gw.add(guessRow);
        
    }
  
    const y = state.guesses.length* (GUESS_SQUARE_SIZE + GUESS_MARGIN * 2) + GUESS_MARGIN;
    const currentGuessRow = createGuessRow(state.currentGuess.split(''), y, BACKGROUND_DEFAULT_COLOR,status);
    gw.add(currentGuessRow);

    // 绘制提示信息
    if (state.alert) {
        const alert = showAlert(state.alert.message, state.alert.color);
        gw.add(alert);
    }

    // 每次 draw 调用时，不重新创建键盘，而是将现有键盘添加回窗口
    gw.add(state.keyboard);
}

function createGuessSquare(letter, color, x, y,status) {
  // Create a compound object to hold the square and letter.
  const compound = GCompound(x, y);
  let backgroundColor;
    if (status === BACKGROUND_CORRECT_COLOR) {
        backgroundColor = BACKGROUND_CORRECT_COLOR;
    } else if (status === BACKGROUND_FOUND_COLOR) {
        backgroundColor = BACKGROUND_FOUND_COLOR;
    } else if(status===BACKGROUND_WRONG_COLOR){
        backgroundColor = BACKGROUND_WRONG_COLOR;
    } else{
        backgroundColor = BACKGROUND_DEFAULT_COLOR;
    }

  // Create the background square with a light gray border.
  const rect = GRect(GUESS_SQUARE_SIZE, GUESS_SQUARE_SIZE);
  rect.setFilled(true);
  rect.setFillColor(backgroundColor);
  rect.setColor(BORDER_COLOR); // Light gray border
  compound.add(rect);

  // Create the letter label in the center of the square.
  const label = GLabel(letter.toUpperCase(), GUESS_SQUARE_SIZE / 2, GUESS_SQUARE_SIZE / 2);
  label.setFont(GUESS_FONT);
  label.setColor(TEXT_DEFAULT_COLOR);
  label.setTextAlign("center");
  label.setBaseline("middle");
  compound.add(label);

  return compound;
}
/*
function createGuessRow(letters, y, color) {
  const compound = GCompound(0, y);  // The row starts at x = 0

  for (let i = 0; i < NUM_LETTERS; i++) {
    const letter = letters[i] || '';  // Use empty string if no letter is present
    const x = i * (GUESS_SQUARE_SIZE + GUESS_MARGIN*2) + GUESS_MARGIN;  // Horizontal position
    const guessSquare = createGuessSquare(letter, color, x, 0,BACKGROUND_DEFAULT_COLOR);  // status????
    compound.add(guessSquare);  // Add square to the compound row
  }

  return compound;
}*/
function createGuessRow(letters, y, color, status) {
    const compound = GCompound(0, y);  // The row starts at x = 0

    for (let i = 0; i < NUM_LETTERS; i++) {
        const letter = letters[i] || '';  // Use empty string if no letter is present
        const x = i * (GUESS_SQUARE_SIZE + GUESS_MARGIN*2) + GUESS_MARGIN;  // Horizontal position
        const guessSquare = createGuessSquare(letter, color, x, 0, status[i]);  // Create square at (x, 0)
        compound.add(guessSquare);  // Add square to the compound row
    }

    return compound;
}
function showAlert(message, color) {
  // Create the GLabel for the alert
  const alertLabel = GLabel(message, ALERT_X, ALERT_Y);
  
  // Set the font, color, and positioning of the alert text
  alertLabel.setFont(ALERT_FONT);
  alertLabel.setColor(color);
  alertLabel.setTextAlign("center");  // Center horizontally
  alertLabel.setBaseline("middle");  // Center vertically relative to its position
  
  // Add the alert to the GWindow
  //gw.add(alertLabel);
  
  return alertLabel;
}


function clearAlert(alertLabel) {
  gw.remove(alertLabel);  // Remove the alert from the GWindow
}
/*
function setupKeyboardEvents(keyboard, gw) {
  // Handle letter key click
  keyboard.addEventListener("keyclick", (letter) => {
    if (state.currentGuess.length < NUM_LETTERS && !state.gameOver) {
      state.currentGuess += letter.toUpperCase();
      draw(gw); // Redraw the game window with the updated guess
    }
  });


  // Handle enter key (submitting the guess)
  keyboard.addEventListener("enter", () => {
    if (state.currentGuess.length === NUM_LETTERS && !state.gameOver) {
      if (!isEnglishWord(state.currentGuess)) {
        state.alert = { message: "Not a valid word", color: "red" };
      } else {
        state.guesses.push(state.currentGuess);

        // Check if the guess is correct
        if (state.currentGuess === state.secretWord) {
          state.alert = { message: "You won!", color: "green" };
          state.gameOver = true;
        } else if (state.guesses.length >= NUM_GUESSES) {
          state.alert = { message: `Game over! The word was ${state.secretWord}`, color: "red" };
          state.gameOver = true;
        }

        // Reset the current guess for the next round
        state.currentGuess = '';
      }

      draw(gw);  // Redraw the game window with the new state
    }
    
  });


  // Handle backspace key
  keyboard.addEventListener("backspace", () => {
    if (state.currentGuess.length > 0 && !state.gameOver) {
      state.currentGuess = state.currentGuess.slice(0, -1);  // Remove the last letter
      draw(gw);  // Redraw the game window with the updated guess
    }
  });
  gw.addEventListener("keyclick", (event) => {
      const letter = getKeystrokeLetter(event); // Get the letter pressed
      if (letter) {
        // Handle letter key click from physical keyboard
        keyboard.triggerKeyClick(letter.toUpperCase());
      } else if (isEnterKeystroke(event)) {
        // Handle enter key from physical keyboard
        keyboard.triggerEnter();
      } else if (isBackspaceKeystroke(event)) {
        // Handle backspace key from physical keyboard
        keyboard.triggerBackspace();
      }
    });
}*/

function setupKeyboardEvents(keyboard, gw) {
    // 处理键盘事件

    keyboard.addEventListener("keyclick", (letter) => {
        state.alert = null;
        if (state.currentGuess.length < NUM_LETTERS && !state.gameOver) {
            state.currentGuess += letter.toUpperCase();
            draw(gw); // 更新窗口
        }
    });

    keyboard.addEventListener("enter", () => {
        if (state.currentGuess.length === NUM_LETTERS && !state.gameOver) {
            if (!isEnglishWord(state.currentGuess.toLowerCase())) {
                state.alert = { message: "Not a valid word", color: "red" };
            } else {
                state.guesses.push(state.currentGuess);
                
                if (state.currentGuess === state.secretWord.toUpperCase()) {
                    state.alert = { message: "You won!", color: "green" };
                    state.gameOver = true;
                } else if (state.guesses.length >= NUM_GUESSES) {
                    state.alert = { message: `Game over! The word was ${state.secretWord}`, color: "red" };
                    state.gameOver = true;
                }

                state.currentGuess = ''; // 重置当前猜测
            }
            
            draw(gw);  // 更新窗口
            

        }
    });

    keyboard.addEventListener("backspace", () => {
        if (state.currentGuess.length > 0 && !state.gameOver) {
            state.currentGuess = state.currentGuess.slice(0, -1);  // 删除最后一个字母
            draw(gw);  // 更新窗口
        }
    });

    gw.addEventListener("keyclick", (event) => {
        const letter = getKeystrokeLetter(event); // 获取按键
        if (letter) {
            keyboard.triggerKeyClick(letter.toUpperCase());
        } else if (isEnterKeystroke(event)) {
            keyboard.triggerEnter();
        } else if (isBackspaceKeystroke(event)) {
            keyboard.triggerBackspace();
        }
    });
}
// 这个函数只会更新当前的字母猜测，而不是重绘整个窗口
function updateCurrentGuess(gw) {
  gw.clear();  // 清除现有的内容
  for (let i = 0; i < state.guesses.length; i++) {
    const guess = state.guesses[i];
    const status = getLetterStatus(guess, state.secretWord);  // 获取字母状态
    const y = i * (GUESS_SQUARE_SIZE + GUESS_MARGIN * 2) + GUESS_MARGIN;
    const guessRow = createGuessRow(guess.split(''), y, status);  // 使用状态颜色绘制
    gw.add(guessRow);
  }

  // 更新当前行，只绘制当前猜测的字母
  const y = state.guesses.length * (GUESS_SQUARE_SIZE + GUESS_MARGIN * 2) + GUESS_MARGIN;
  const currentGuessRow = createGuessRow(state.currentGuess.split(''), y, BACKGROUND_DEFAULT_COLOR);
  gw.add(currentGuessRow);

  // Draw alert if present
  if (state.alert) {
    const alert = showAlert(state.alert.message, state.alert.color);
    gw.add(alert);
  }
}
function updateKeyboard(guess, status) {
  // 遍历猜测的字母和状态，更新键盘颜色
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const color = status[i];
    // 假设 GKeyboard 有方法 setKeyColor 更新键盘按键的颜色
    keyboard.setKeyColor(letter, color);
  }
}
function getLetterStatus(guess, secretWord) {
    const status = Array(NUM_LETTERS).fill(BACKGROUND_WRONG_COLOR);
    const secretWordArray = secretWord.toUpperCase().split('');

    

    // 检查正确字母
    for (let i = 0; i < NUM_LETTERS; i++) {
        if (guess[i] === secretWordArray[i]) {
            status[i] = BACKGROUND_CORRECT_COLOR;
            secretWordArray[i] = null; // 将已匹配的字母置为 null，避免重复匹配
        }
    }

    // 检查部分匹配
    for (let i = 0; i < NUM_LETTERS; i++) {
        if (status[i] === BACKGROUND_WRONG_COLOR && secretWordArray.includes(guess[i])) {
            status[i] = BACKGROUND_FOUND_COLOR;
            const index = secretWordArray.indexOf(guess[i]);
            secretWordArray[index] = null; // 将已匹配的字母置为 null
        }
    }


    return status;
}

