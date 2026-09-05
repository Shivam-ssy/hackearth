import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // If a property name is passed (e.g., @GetUser('_id')), return that property
        return data ? user?.[data] : user;
    },
);
