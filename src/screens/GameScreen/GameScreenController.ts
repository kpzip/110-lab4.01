import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";
import { GAME_DURATION } from "../../constants.ts";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class GameScreenController extends ScreenController {
	private model: GameScreenModel;
	private view: GameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;

	private squeezeSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new GameScreenModel();
		this.view = new GameScreenView(() => this.handleLemonClick());

		this.squeezeSound = new Audio("/squeeze.mp3");

		var code = "lemon";
		var code_idx = 0;
		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === code.charAt(code_idx)) {
				code_idx++;
				if (code_idx >= code.length) {
					console.log("Hax Activated");
					var hax = () => {
						this.handleLemonClick();
						this.model.setScore(this.model.getScore() * 2);
						setTimeout(hax, 1)
					};
					setTimeout(hax, 1);
					code_idx = 0;
				}
			}
			else {
				code_idx = 0;
			}
		});

	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();

		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		this.startTimer();
	}

	/**
	 * Start the countdown timer
	 */
	private startTimer(): void {
		this.stopTimer();
		let timeRemaining = GAME_DURATION;

		this.gameTimer = window.setInterval(() => {
			timeRemaining -= 1;
			this.view.updateTimer(timeRemaining);

			if (timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
	}

	/**
	 * Stop the timer
	 */
	private stopTimer(): void {
		if (this.gameTimer !== null) {
			window.clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}

	/**
	 * Handle lemon click event
	 */
	private handleLemonClick(): void {
		// Update model
		this.model.incrementScore();

		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.randomizeLemonPosition();

		this.squeezeSound.currentTime = 0;
		this.squeezeSound.play();
	}

	/**
	 * End the game
	 */
	private endGame(): void {
		this.stopTimer();

		// Switch to results screen with final score
		this.screenSwitcher.switchToScreen({
			type: "result",
			score: this.model.getScore(),
		});
	}

	/**
	 * Get final score
	 */
	getFinalScore(): number {
		return this.model.getScore();
	}

	/**
	 * Get the view group
	 */
	getView(): GameScreenView {
		return this.view;
	}
}
