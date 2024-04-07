import { Update, On, Start, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  private user: any;
  private car: any;
  private step: number;

  constructor() {
    this.user = {};
    this.car = {};
    this.step = 0;
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    this.step = 0;
    await ctx.reply(
      `Hello${ctx.from.first_name}\nTo register for a car wash, click the (Register) button at the bottom of the screen`,
      {
        reply_markup: {
          keyboard: [
            [{ text: 'Register' }, { text: 'About us' }],
            [{ text: 'Our location 📍' }, { text: 'Contact us 📲' }],
          ],
          resize_keyboard: true,
        },
      },
    );
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context) {
    const message = ctx.message;
    let messageText: string | undefined;

    if ('text' in message) {
      messageText = message.text;
    } else {
      return; // Ignore updates without text
    }

    switch (messageText) {
      case 'Our location 📍':
        await ctx.sendLocation(35.804819, 51.43407, { live_period: 86400 });
        break;
      case 'Contact us📲':
        this.user.id = ctx.from.id;
        this.step++;
        await ctx.reply('Enter your name', {
          reply_markup: {
            keyboard: [[{ text: 'Go back' }]],
            resize_keyboard: true,
          },
        });
        break;
      case 'Go back':
        this.step--;
        break;
      case 'About us':
        await ctx.reply(
          `Car servicing has always been one of the profitable service industries. Especially if every car owner services his car himself, this is nothing but a great opportunity.`,
        );
        break;
      case 'Register':
        await ctx.reply('Enter your car type', {
          reply_markup: {
            keyboard: [[{ text: 'Passanger car' }, { text: 'Truck' }]],
            resize_keyboard: true,
          },
        });
        this.step = 10; // Set step to a value that won't trigger the following condition blocks
        break;
      case 'Passanger car':
        this.car.id = ctx.from.id;
        this.step++;
        await ctx.reply('Enter your car name', {
          reply_markup: {
            keyboard: [[{ text: 'Go Back' }]],
            resize_keyboard: true,
          },
        });
        break;
      default:
        if (this.step === 1) {
          this.user.name = messageText;
          this.step++;
          await ctx.reply('Enter your age', {
            reply_markup: {
              keyboard: [[{ text: ' Go back' }]],
              resize_keyboard: true,
            },
          });
        } else if (this.step === 2) {
          this.user.age = messageText;
          this.step++;
          await ctx.reply('Enter your car name', {
            reply_markup: {
              keyboard: [[{ text: 'Go Back' }]],
              resize_keyboard: true,
            },
          });
        } else if (this.step === 3) {
          this.car.name = messageText;
          await ctx.reply(
            `User ID: ${this.user.id}\nName: ${this.user.name}\nAge: ${this.user.age}\nCar Name: ${this.car.name}`,
          );
          this.step = 0; // Reset the step
        }
    }
  }
}
