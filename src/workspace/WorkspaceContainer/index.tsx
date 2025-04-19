import { ReactNode, useMemo } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Workspace from '../Workspace';

const HeaderLeftSideContainer = styled('div')({
	fontSize: 16,
	fontWeight: 'bold',
	color: 'gray'
});

type IWorkspaceContainerProps = {
	children: ReactNode;
	onNext: () => void;
	onPrev: () => void;
	currentSampleIndex?: number;
	numberOfSamples?: number;
	globalSampleIndex?: number;
	titleContent?: string;
	onClickHeaderItem: () => void;
};

export const WorkspaceContainer = ({
	children,
	onNext,
	onPrev,
	currentSampleIndex = 0,
	numberOfSamples = 1,
	globalSampleIndex = 1,
	titleContent,
	onClickHeaderItem,
}: IWorkspaceContainerProps) => {
	const headerItems = useMemo(
		() => [
			{
				name: 'Prev',
				onClick: onPrev,
				disabled: currentSampleIndex === 0,
			},
			{
				name: 'Next',
				onClick: onNext,
			},
			{ name: 'Save' },
		],
		[currentSampleIndex, onNext, onPrev]
	);

	return (
		<Workspace
			headerLeftSide={
				titleContent === undefined
					? [
							<Box paddingLeft={2} key={"sample info"}>
								<HeaderLeftSideContainer>
									Image{' '}
									{numberOfSamples > 1
										? `${currentSampleIndex} / ${numberOfSamples}`
										: `${globalSampleIndex}`}
								</HeaderLeftSideContainer>
							</Box>,
						]
					: [<Box paddingLeft={2} key={"sample info"}>
						<HeaderLeftSideContainer>
							{titleContent}
						</HeaderLeftSideContainer>
					</Box>]
			}
			onClickHeaderItem={onClickHeaderItem}
			headerItems={headerItems}
			iconSidebarItems={[]}
			rightSidebarItems={[]}
			onClickIconSidebarItem={() => {}}
		>
			<Box padding={[2, 0]} style={{ width: '100%' }}>
				{children}
			</Box>
		</Workspace>
	);
};

export default WorkspaceContainer;
