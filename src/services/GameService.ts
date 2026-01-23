import { GamePhaseType } from './types'

class GameService {
  phaseHandlers = {
    waiting: this.handleWaitingPhase,
    keyword: this.handleKeywordPhase,
    drawing: this.handleDrawingPhase,
    discussion: this.handleDiscussionPhase,
    voting: this.handleVotingPhase,
    voteResult: this.handleVoteResultPhase,
    guessing: this.handleGuessingPhase,
    result: this.handleResultPhase,
  }

  updatePhase(state: GamePhaseType): void {
    // 게임 상태를 업데이트하는 로직
  }

  newRound(roundNumber: number): void {
    // 새로운 라운드
  }

  startGame(roomId: string): void {
    // 게임을 시작하는 로직
  }

  handleWaitingPhase(): void {
    // 대기방 단계
  }

  handleKeywordPhase(): void {
    // 키워드 표시 단계
  }

  handleDrawingPhase(): void {
    // 그림 그리기 단계
  }

  handleDiscussionPhase(): void {
    // 토론 단계
  }

  handleVotingPhase(): void {
    // 투표 단계
  }

  handleVoteResultPhase(): void {
    // 투표 결과 발표 단계
  }

  handleGuessingPhase(): void {
    // 라이어의 제시어 추측 단계
  }

  handleResultPhase(): void {
    // 결과 발표 단계
  }

  endGame(roomId: string): void {
    // 게임을 종료하는 로직
  }
}

const gameService = new GameService()

export { gameService }
