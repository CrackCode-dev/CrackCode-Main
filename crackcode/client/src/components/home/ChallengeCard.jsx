import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const ChallengeCard = ({
    title,
    description,
    points,
    completed,
    total,
    buttonText='Start Challenge',
    buttonVariant='outline',
    onButtonClick,
    variant='flat',
    className='',
    ...rest
}) => {
    return (
        <Card
            variant={variant}
            title={title}
            badge={points &&<Badge type='point' size='md'>{points}</Badge>}
            subtitle={description}
            className={className}
            {...rest}
            >
            <div className='space-y-4'>
                <ProgressBar
                    size='sm'
                    completed={completed}
                    total={total}
                    variant='default'
                    labelText='cases completed'
                    showLabel
                />
                <Button variant={buttonVariant} fullWidth onClick={onButtonClick}>{buttonText}</Button>
            </div>
        </Card>
    )
}

export default ChallengeCard;