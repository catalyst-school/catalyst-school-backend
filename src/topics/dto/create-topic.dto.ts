export class CreateTopicDto {
    title: string;
    chapter: string;
    sections: [{
        type: string; // should be enum
    }];
}
