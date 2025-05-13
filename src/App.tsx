import { useEffect, useState } from 'react';
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png'
import restartIcon from './svgs/restart.svg'
import { Button } from './components/Button';
import { InfoItem } from './components/infoItem';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { clear, time } from 'console';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount] = useState<number>(0);
    const [showCount, setShowCount] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => resetAndCreateGrid(), []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (playing) setTimeElapsed(timeElapsed + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed]);

    useEffect(() => {
        if (showCount === 2) {
            let opened = gridItems.filter(item => item.shown === true);
            if (opened.length === 2) {
                if (opened[0].item === opened[1].item) {
                    let tempGrid = [...gridItems];
                    for (let i in tempGrid) {
                        if (tempGrid[i].shown === true) {
                            tempGrid[i].permanentShown = true;
                            tempGrid[i].shown = false;
                        }
                    }
                    setGridItems(tempGrid);
                    setShowCount(0);
                } else {
                    setTimeout(() => {
                        let tempGrid = [...gridItems];
                        for (let i in tempGrid) {
                            tempGrid[i].shown = false;
                        }
                        setGridItems(tempGrid);
                        setShowCount(0);
                    }, 1000);
                }

                setMoveCount(moveCount + 1);
            }
        }
    }, [showCount, gridItems]);

    useEffect(() => {
        if (moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
            setPlaying(false);
        }
    }, [moveCount, gridItems]);
    
    const resetAndCreateGrid = () => {
        // step 1 - Reset the game
        setTimeElapsed(0);
        setMoveCount(0);
        setShowCount(0);

        // step 2 - Create the grid
        // 2.1 - Create the grid items        
        let tempGrid: GridItemType[] = [];
        for (let i = 0; i < (items.length * 2); i++) tempGrid.push({
            item: null, shown: false, permanentShown: false
        });

        // 2.2 - Create the items
        for (let w = 0; w < 2; w++) {
            for (let i = 0; i < items.length; i++) {
                let pos = -1;
                while (pos < 0 || tempGrid[pos].item !== null) {
                    pos = Math.floor(Math.random() * (items.length * 2));
                }
                tempGrid[pos].item = i;
            }
        }

        // 2.3 - Shuffle the items
        setGridItems(tempGrid)

        // step 3 - Start the game
        setPlaying(true);
    }

    const handleClickItem = (index: number) => {
        if (playing && index !== null && showCount < 2) {
            let tempGrid = [...gridItems];

            if (tempGrid[index].permanentShown === false && tempGrid[index].shown === false) {
                tempGrid[index].shown = true;
                setShowCount(showCount + 1);
            }
            setGridItems(tempGrid);
        }
    }

    return (
        <div className="">
            <C.Container>
                <C.Info>
                    <C.LogoLink href="">
                        <img src={logoImage} width="200" alt="" />
                    </C.LogoLink>

                    <C.InfoArea>
                        <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
                        <InfoItem label="Movimentos" value={moveCount.toString()} />
                    </C.InfoArea>

                    <Button label="Reiniciar" icon={restartIcon} onClick={resetAndCreateGrid} />
                </C.Info>

                <C.GridArea>
                    <C.Grid>
                        {gridItems.map((item, index) => (
                            <GridItem
                                key={index}
                                item={item}
                                onClick={() => handleClickItem(index)}
                            />
                        ))}
                    </C.Grid>
                </C.GridArea>
            </C.Container>
        </div>
    );
}
export default App;