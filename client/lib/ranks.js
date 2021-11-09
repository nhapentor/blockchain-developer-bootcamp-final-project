export const ranks = {
	SCOUT: "scout",
	HIKER: "hiker",
	EXPLORER: "explorer",
	ADVENTURER: "adventurer",
    MOUNTAINEER: "mountaineer",
    EXPEDITIONER: "expeditioner",
    RANGER: "ranger"
}


export const getRankImageUrl = (rank) => {

    const rootPath = '/img/ranks';

    switch (rank) {
        case ranks.SCOUT:
            return `${rootPath}/rank-scout.png`
        case ranks.HIKER:
            return `${rootPath}/rank-hiker.png`
        case ranks.EXPLORER:
            return `${rootPath}/rank-explorer.png`
        case ranks.ADVENTURER:
            return `${rootPath}/rank-adventurer.png`
        case ranks.MOUNTAINEER:
            return `${rootPath}/rank-mountaineer.png`
        case ranks.EXPEDITIONER:
            return `${rootPath}/rank-expeditioner.png`
        case ranks.RANGER:
            return `${rootPath}/rank-ranger.png`
        default:
            throw Error(`Unknown rank: ${rank}`)
    }
}

export const getRankByPoints = (points) => {

    if (points < 200) {

        return { 
            rank: ranks.SCOUT,
            points: 1,
            imageUrl: getRankImageUrl(ranks.SCOUT)
        }

    } else if (points >= 200 && points < 500) {
        
        return { 
            rank: ranks.HIKER,
            points: 200,
            imageUrl: getRankImageUrl(ranks.HIKER)
        }

    } else if (points >= 500 && points < 800) {
        
        return { 
            rank: ranks.EXPLORER,
            points: 500,
            imageUrl: getRankImageUrl(ranks.EXPLORER)
        }

    } else if (points >= 800 && points < 1200) {
        
        return { 
            rank: ranks.ADVENTURER,
            points: 800,
            imageUrl: getRankImageUrl(ranks.ADVENTURER)
        }

    } else if (points >= 1200 && points < 1500) {
        
        return { 
            rank: ranks.MOUNTAINEER,
            points: 1200,
            imageUrl: getRankImageUrl(ranks.MOUNTAINEER)
        }

    } else if (points >= 1500 && points < 1800) {
        
        return { 
            rank: ranks.EXPEDITIONER,
            points: 1500,
            imageUrl: getRankImageUrl(ranks.EXPEDITIONER)
        }

    } else if (points >= 1800) {
        
        return { 
            rank: ranks.RANGER,
            points: 1800,
            imageUrl: getRankImageUrl(ranks.RANGER)
        }

    }

}

export const getNextRankByPoints  = (points) => {

    const rank = getRankByPoints(points).rank

    switch (rank) {
        case ranks.SCOUT:
            return { 
                rank: ranks.HIKER,
                points: 200,
                imageUrl: getRankImageUrl(ranks.HIKER)
            }
        case ranks.HIKER:
            return { 
                rank: ranks.EXPLORER,
                points: 500,
                imageUrl: getRankImageUrl(ranks.EXPLORER)
            }
        case ranks.EXPLORER:
            return { 
                rank: ranks.ADVENTURER,
                points: 800,
                imageUrl: getRankImageUrl(ranks.ADVENTURER)
            }
        case ranks.ADVENTURER:
            return { 
                rank: ranks.MOUNTAINEER,
                points: 1200,
                imageUrl: getRankImageUrl(ranks.MOUNTAINEER)
            }
        case ranks.MOUNTAINEER:
            return { 
                rank: ranks.EXPEDITIONER,
                points: 1500,
                imageUrl: getRankImageUrl(ranks.EXPEDITIONER)
            }
        case ranks.EXPEDITIONER:
            return { 
                rank: ranks.RANGER,
                points: 1800,
                imageUrl: getRankImageUrl(ranks.RANGER)
            }
        case ranks.RANGER:
            return { 
                rank: ranks.RANGER,
                points: 1800,
                imageUrl: getRankImageUrl(ranks.RANGER)
            }
        default:
            throw Error(`Unknown rank: ${rank}`)
    }

}